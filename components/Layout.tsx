
import React, { useState, PropsWithChildren } from 'react';
import { useApp } from '../contexts/AppContext';
import { UserRole } from '../types';
import { 
  Home, 
  Briefcase, 
  Users, 
  MessageSquare, 
  AlertTriangle, 
  FileText, 
  LogOut, 
  Menu,
  Activity,
  User as UserIcon,
  Bell,
  Clock,
  Megaphone
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children }: PropsWithChildren) => {
  const { currentUser, logout, notifications, markNotificationAsRead } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  if (!currentUser) return <>{children}</>;

  const unreadCount = notifications.filter(n => !n.isRead && n.userId === currentUser.id).length;
  const myNotifications = notifications.filter(n => n.userId === currentUser.id);

  const NavItem = ({ icon: Icon, label, path }: { icon: any, label: string, path: string }) => {
    const isActive = location.pathname === path;
    return (
      <button
        onClick={() => {
            navigate(path);
            setIsSidebarOpen(false);
        }}
        className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all ${
          isActive 
            ? 'bg-peregrine-600 text-white shadow-lg shadow-peregrine-200 dark:shadow-none' 
            : 'text-peregrine-900 dark:text-slate-200 hover:bg-peregrine-100 dark:hover:bg-slate-700'
        }`}
      >
        <Icon size={24} />
        <span className="font-medium">{label}</span>
      </button>
    );
  };

  const roleMenus = {
    [UserRole.COO]: [
      { icon: Activity, label: 'Dashboard', path: '/dashboard' },
      { icon: Briefcase, label: 'Projects', path: '/projects' },
      { icon: Megaphone, label: 'Announcements', path: '/announcements' },
      { icon: MessageSquare, label: 'Chat', path: '/chat' },
      { icon: Users, label: 'Personnel', path: '/employees' },
      { icon: Clock, label: 'Time Sheet', path: '/timesheet' },
    ],
    [UserRole.MANAGER]: [
      { icon: Briefcase, label: 'My Projects', path: '/projects' },
      { icon: Users, label: 'Personnel', path: '/employees' },
      { icon: AlertTriangle, label: 'Incidents', path: '/incidents' },
      { icon: Megaphone, label: 'Announcements', path: '/announcements' },
      { icon: MessageSquare, label: 'Chat', path: '/chat' },
      { icon: Clock, label: 'Time Sheet', path: '/timesheet' },
    ],
    [UserRole.HR]: [
      { icon: Users, label: 'Personnel', path: '/employees' },
      { icon: Clock, label: 'Time Sheet', path: '/timesheet' },
      { icon: Megaphone, label: 'Announcements', path: '/announcements' },
      { icon: Briefcase, label: 'Projects', path: '/projects' },
      { icon: MessageSquare, label: 'Chat', path: '/chat' },
    ],
    [UserRole.EMPLOYEE]: [
      { icon: Home, label: 'Tasks', path: '/dashboard' },
      { icon: Megaphone, label: 'Announcements', path: '/announcements' },
      { icon: Clock, label: 'Time Sheet', path: '/timesheet' },
      { icon: Briefcase, label: 'Projects', path: '/projects' },
      { icon: AlertTriangle, label: 'Report Incident', path: '/incidents' },
      { icon: MessageSquare, label: 'Chat', path: '/chat' },
    ]
  };

  const menus = roleMenus[currentUser.role] || roleMenus[UserRole.EMPLOYEE];
  const profileMenu = { icon: UserIcon, label: 'My Profile', path: '/profile' };

  return (
    <div className={`min-h-screen bg-peregrine-50 dark:bg-slate-900 flex flex-col md:flex-row transition-colors duration-200`}>
      <div className="md:hidden bg-gradient-to-r from-peregrine-700 to-peregrine-600 dark:from-slate-800 dark:to-slate-900 p-4 flex justify-between items-center text-white shadow-md sticky top-0 z-50">
        <div className="flex items-center space-x-2">
            <div className="bg-white p-1 rounded-full">
               <Briefcase className="text-peregrine-600" size={20} />
            </div>
            <span className="font-bold text-lg tracking-wide">PEREGRINE</span>
        </div>
        <div className="flex items-center space-x-4">
            <button className="relative" onClick={() => setShowNotifications(!showNotifications)}>
                <Bell size={24} />
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>}
            </button>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <Menu size={28} />
            </button>
        </div>
      </div>

      <div className={`
        fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 transition duration-200 ease-in-out
        w-64 bg-white dark:bg-slate-800 shadow-xl z-40 flex flex-col border-r border-slate-100 dark:border-slate-700
      `}>
        <div className="p-6 border-b border-peregrine-100 dark:border-slate-700 hidden md:flex items-center space-x-3">
             <div className="bg-peregrine-600 p-2 rounded-full text-white">
                <Briefcase size={24} />
             </div>
             <div>
                <h1 className="text-xl font-bold text-peregrine-900 dark:text-white">PEREGRINE</h1>
                <p className="text-xs text-peregrine-600 dark:text-peregrine-400 font-semibold">CONSTRUCTION INC.</p>
             </div>
        </div>

        <div className="p-6 flex flex-col items-center border-b border-peregrine-100 dark:border-slate-700 bg-peregrine-50/50 dark:bg-slate-800">
            <img src={currentUser.avatar} alt="Profile" className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-600 shadow-md mb-3 object-cover" />
            <h2 className="font-bold text-gray-800 dark:text-gray-100 text-center">{currentUser.name}</h2>
            <p className="text-xs text-peregrine-600 dark:text-peregrine-300 font-semibold bg-peregrine-100 dark:bg-slate-700 px-3 py-1 rounded-full mt-1">
                {currentUser.position}
            </p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menus.map((menu) => (
            <NavItem key={menu.path} {...menu} />
          ))}
          <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-700">
             <NavItem {...profileMenu} />
          </div>
        </nav>

        <div className="p-4 border-t border-peregrine-100 dark:border-slate-700">
            <button onClick={logout} className="flex items-center space-x-3 w-full p-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <LogOut size={24} />
                <span className="font-medium">Logout</span>
            </button>
        </div>
      </div>

      {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen bg-peregrine-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 relative">
        <div className="hidden md:flex justify-end p-4 absolute top-0 right-0 z-20">
             <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors relative">
                    <Bell size={20} className="text-slate-600 dark:text-slate-300" />
                    {unreadCount > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>}
                </button>
                {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
                        <div className="p-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                            <h3 className="font-bold text-sm">Notifications</h3>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {myNotifications.length === 0 ? <div className="p-4 text-center text-slate-400 text-sm">No new notifications</div> : myNotifications.map(n => (
                                <div key={n.id} onClick={() => markNotificationAsRead(n.id)} className={`p-3 border-b border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 ${!n.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}>
                                    <div className="flex justify-between items-start mb-1"><span className="font-semibold text-sm">{n.title}</span><span className="text-[10px] text-slate-400">{n.timestamp}</span></div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300">{n.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
             </div>
        </div>
        <div className="p-4 md:p-8 max-w-5xl mx-auto pb-20 md:pb-0 pt-16 md:pt-8">
             {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
