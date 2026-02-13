import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { UserRole, User } from '../types';
// Added User as UserIcon to resolve naming collision with the User type
import { Users, UserPlus, UserX, Trash2, Search, Mail, Calendar, Award, Briefcase, Phone, Edit, Check, FileText, Download, User as UserIcon } from 'lucide-react';

const EmployeeManagement = () => {
  const { users, addUser, updateUser, resignUser, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'active' | 'resigned' | 'org_chart'>('active');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Edit/Promote State
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
      name: '',
      role: UserRole.EMPLOYEE,
      position: ''
  });

  // New User Form State
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: UserRole.EMPLOYEE,
    position: ''
  });

  // UPDATED PERMISSION: Strictly limited to HR only as requested
  const isHR = currentUser?.role === UserRole.HR;
  
  const filteredUsers = users.filter(u => u.status === activeTab);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isHR) return;
    addUser({
        id: Math.random().toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        position: newUser.position,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        avatar: `https://ui-avatars.com/api/?name=${newUser.name}&background=random`,
        certifications: [],
        assignedEquipment: [],
        resumeUrl: '#'
    });
    setShowAddModal(false);
    setNewUser({ name: '', email: '', role: UserRole.EMPLOYEE, position: '' });
  };

  const handleResign = (userId: string) => {
    if (!isHR) return; // Guard clause for security
    if (window.confirm("Are you sure you want to process resignation for this employee? Their account will be deactivated but data preserved.")) {
      resignUser(userId);
    }
  };

  const handleEditClick = (user: User) => {
      if (!isHR) return;
      setEditingUserId(user.id);
      setEditForm({
          name: user.name,
          role: user.role,
          position: user.position
      });
  };

  const handleSaveEdit = () => {
      if (editingUserId && isHR) {
          updateUser(editingUserId, {
              name: editForm.name,
              role: editForm.role,
              position: editForm.position
          });
          setEditingUserId(null);
          alert("Employee record updated successfully.");
      }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-peregrine-900 dark:text-white">Personnel Management</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Employee database, profiles, and history</p>
        </div>
        {/* UPDATED: Only HR can add employees */}
        {isHR && (
            <button 
                onClick={() => setShowAddModal(true)}
                className="bg-peregrine-600 hover:bg-peregrine-700 text-white px-4 py-2 rounded-xl flex items-center shadow-md transition-colors"
            >
            <UserPlus size={20} className="mr-2" />
            Add Employee
            </button>
        )}
      </div>

      <div className="flex space-x-1 bg-white dark:bg-slate-800 p-1 rounded-xl w-full md:w-fit mb-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                activeTab === 'active' 
                ? 'bg-peregrine-100 dark:bg-slate-600 text-peregrine-800 dark:text-white shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
        >
            <Users size={16} className="mr-2" />
            Active
        </button>
        <button
            onClick={() => setActiveTab('resigned')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                activeTab === 'resigned' 
                ? 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
        >
            <UserX size={16} className="mr-2" />
            History
        </button>
        <button
            onClick={() => setActiveTab('org_chart')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                activeTab === 'org_chart' 
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
        >
            <Briefcase size={16} className="mr-2" />
            Org Chart
        </button>
      </div>

      {activeTab === 'org_chart' ? (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center overflow-x-auto no-scrollbar">
              <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Organization Hierarchy</h3>
              {/* Simplified Org View - Filtered for ACTIVE only */}
              <div className="flex flex-col items-center space-y-8 min-w-fit">
                  {users.filter(u => u.role === UserRole.COO && u.status === 'active').map(u => (
                      <div key={u.id} className="p-4 bg-peregrine-100 dark:bg-peregrine-900/30 border-2 border-peregrine-500 rounded-xl w-64 shadow-lg">
                          <p className="font-bold text-peregrine-900 dark:text-white">{u.name}</p>
                          <p className="text-sm text-peregrine-700 dark:text-peregrine-300">{u.position}</p>
                      </div>
                  ))}
                  <div className="w-1 h-8 bg-slate-300 dark:bg-slate-600"></div>
                  <div className="flex flex-wrap justify-center gap-8">
                     {users.filter(u => u.role === UserRole.MANAGER && u.status === 'active').map(u => (
                          <div key={u.id} className="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-xl w-56">
                              <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                              <p className="text-sm text-blue-800 dark:text-blue-300">{u.position}</p>
                          </div>
                      ))}
                  </div>
                  <div className="w-full border-t border-slate-200 dark:border-slate-700 pt-8">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Staff & Support Personnel</p>
                      <div className="flex flex-wrap justify-center gap-4">
                        {users.filter(u => (u.role === UserRole.EMPLOYEE || u.role === UserRole.HR) && u.status === 'active').map(u => (
                                <div key={u.id} className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl w-48 text-sm border border-slate-100 dark:border-slate-600 shadow-sm">
                                    <p className="font-bold text-slate-800 dark:text-white">{u.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{u.position}</p>
                                </div>
                            ))}
                      </div>
                  </div>
              </div>
          </div>
      ) : (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        {filteredUsers.length === 0 ? (
            <div className="p-20 text-center">
                <Users size={48} className="mx-auto mb-4 text-slate-200" />
                <p className="text-slate-400 font-medium">No {activeTab} employees found.</p>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
                        <tr>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Employee</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Role & Position</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hidden md:table-cell">Contact</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hidden lg:table-cell">History</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="p-4 cursor-pointer" onClick={() => setSelectedUser(user)}>
                                    <div className="flex items-center">
                                        <img src={user.avatar} alt="" className="w-10 h-10 rounded-full mr-3 object-cover bg-slate-200 dark:bg-slate-600 border border-slate-100 dark:border-slate-600" />
                                        <div>
                                            <span className="font-bold text-slate-800 dark:text-white block hover:underline text-sm">{user.name}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">ID: {user.id.substring(0,6)}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="text-sm font-bold text-peregrine-900 dark:text-peregrine-300">{user.position}</div>
                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-tighter">{user.role}</div>
                                </td>
                                <td className="p-4 hidden md:table-cell">
                                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                        <Mail size={14} className="mr-2 text-slate-400" />
                                        {user.email}
                                    </div>
                                </td>
                                <td className="p-4 hidden lg:table-cell">
                                    <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center font-medium">
                                        <Calendar size={14} className="mr-2 text-slate-400" />
                                        In: {user.joinDate}
                                    </div>
                                    {user.resignDate && (
                                        <div className="text-xs text-red-500 dark:text-red-400 flex items-center mt-1 font-bold">
                                            <UserX size={14} className="mr-2" />
                                            Out: {user.resignDate}
                                        </div>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    <button 
                                        onClick={() => setSelectedUser(user)}
                                        className="text-blue-600 hover:text-blue-800 font-bold text-xs uppercase tracking-widest mr-3"
                                    >
                                        Profile
                                    </button>
                                    
                                    {/* UPDATED: Only HR can modify employee records */}
                                    {isHR && activeTab === 'active' && user.role !== UserRole.COO && (
                                        <div className="inline-flex items-center">
                                            <button 
                                                onClick={() => handleEditClick(user)}
                                                className="text-slate-400 hover:text-peregrine-600 p-2 rounded-lg transition-colors"
                                                title="Edit / Promote"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            
                                            <button 
                                                onClick={() => handleResign(user.id)}
                                                className="text-slate-400 hover:text-red-600 p-2 rounded-lg transition-colors ml-1"
                                                title="Mark as Resigned"
                                            >
                                                <UserX size={18} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
      )}

      {/* Detailed User Profile Modal */}
      {selectedUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                  <div className="flex justify-between items-start mb-8">
                      <div className="flex items-center">
                          <img src={selectedUser.avatar} className="w-20 h-20 rounded-2xl mr-5 border-2 border-peregrine-500 shadow-lg object-cover" alt=""/>
                          <div>
                              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{selectedUser.name}</h3>
                              <p className="text-peregrine-600 dark:text-peregrine-400 font-bold uppercase tracking-widest text-xs">{selectedUser.position}</p>
                          </div>
                      </div>
                      <button onClick={() => setSelectedUser(null)} className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-700 dark:text-slate-400 rounded-xl transition-colors">
                          <Trash2 size={20} className="rotate-45" />
                      </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                          <div className="p-5 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                              {/* Replaced User with UserIcon to resolve naming collision */}
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center"><UserIcon size={16} className="mr-2"/> Employee Core Data</h4>
                              <div className="space-y-3">
                                  <div>
                                      <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Corporate Email</p>
                                      <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedUser.email}</p>
                                  </div>
                                  <div>
                                      <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Phone Access</p>
                                      <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedUser.phone || 'N/A'}</p>
                                  </div>
                                  <div>
                                      <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Emergency Contact</p>
                                      <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedUser.emergencyContact || 'N/A'}</p>
                                  </div>
                                  <div>
                                      <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Onboarding Date</p>
                                      <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedUser.joinDate}</p>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="space-y-6">
                          <div className="p-5 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center"><FileText size={16} className="mr-2"/> HR Attachments</h4>
                              {selectedUser.resumeUrl ? (
                                  <a href={selectedUser.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-xl hover:shadow-md transition-all group cursor-pointer">
                                      <div className="flex items-center">
                                          <div className="bg-red-50 dark:bg-red-900/30 p-2 rounded-lg text-red-600 dark:text-red-400 mr-3">
                                              <FileText size={20} />
                                          </div>
                                          <div>
                                              <p className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-tight">Full CV / Resume</p>
                                              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Archived PDF</p>
                                          </div>
                                      </div>
                                      <Download size={16} className="text-slate-400 group-hover:text-peregrine-600 dark:group-hover:text-peregrine-400" />
                                  </a>
                              ) : (
                                  <p className="text-xs text-slate-400 italic">No resume data found for this profile.</p>
                              )}
                          </div>
                          
                          <div className="p-5 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center"><Award size={16} className="mr-2"/> Active Certifications</h4>
                              {selectedUser.certifications && selectedUser.certifications.length > 0 ? (
                                  <ul className="space-y-2">
                                      {selectedUser.certifications.map((c, i) => (
                                          <li key={i} className="flex justify-between items-center bg-white dark:bg-slate-800 p-2 px-3 rounded-lg border border-slate-100 dark:border-slate-600">
                                              <span className="text-xs font-bold text-slate-800 dark:text-white">{c.name}</span>
                                              <span className="text-[9px] font-black text-slate-400 uppercase">Exp: {c.expiry}</span>
                                          </li>
                                      ))}
                                  </ul>
                              ) : <p className="text-xs text-slate-400 italic">No formal certifications listed.</p>}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Edit / Promote Modal */}
      {editingUserId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200 border border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-peregrine-100 dark:bg-peregrine-900/30 text-peregrine-600 rounded-2xl">
                        <Edit size={24} />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Modify Personnel</h3>
                  </div>
                  <div className="space-y-5">
                      <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Official Name</label>
                          <input 
                              type="text" 
                              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-peregrine-500 font-bold"
                              value={editForm.name}
                              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          />
                      </div>
                      
                      <div className="grid grid-cols-1 gap-5">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">System Permission Role</label>
                            <select 
                                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-peregrine-500 font-bold appearance-none"
                                value={editForm.role}
                                onChange={(e) => setEditForm({...editForm, role: e.target.value as UserRole})}
                            >
                                <option value={UserRole.EMPLOYEE}>Standard Employee</option>
                                <option value={UserRole.MANAGER}>Project Manager</option>
                                <option value={UserRole.HR}>HR Administrator</option>
                                <option value={UserRole.COO}>Chief Executive (COO)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Designated Job Title</label>
                            <input 
                                type="text" 
                                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-peregrine-500 font-bold"
                                value={editForm.position}
                                onChange={(e) => setEditForm({...editForm, position: e.target.value})}
                            />
                        </div>
                      </div>

                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-2xl border border-orange-100 dark:border-orange-900/40">
                          <p className="text-xs text-orange-800 dark:text-orange-200 font-medium leading-relaxed">
                            <strong>Note:</strong> Elevating a role grants immediate access to restricted project folders and executive dashboards.
                          </p>
                      </div>

                      <div className="flex gap-4 pt-4">
                          <button onClick={() => setEditingUserId(null)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-colors">Discard</button>
                          <button onClick={handleSaveEdit} className="flex-1 py-4 bg-peregrine-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-peregrine-700 shadow-xl shadow-peregrine-100 dark:shadow-none transition-all active:scale-95">Commit Updates</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200 border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-peregrine-600 text-white rounded-2xl shadow-lg">
                      <UserPlus size={24} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Onboard Personnel</h3>
                </div>
                <form onSubmit={handleCreateUser} className="space-y-5">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Full Legal Name</label>
                        <input 
                            type="text" 
                            required
                            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-peregrine-500 font-bold"
                            value={newUser.name}
                            onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Corporate Email Address</label>
                        <input 
                            type="email" 
                            required
                            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-peregrine-500 font-bold"
                            value={newUser.email}
                            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-5">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Initial System Role</label>
                            <select 
                                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-peregrine-500 font-bold appearance-none"
                                value={newUser.role}
                                onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
                            >
                                <option value={UserRole.EMPLOYEE}>Standard Employee</option>
                                <option value={UserRole.MANAGER}>Project Manager</option>
                                <option value={UserRole.HR}>HR Administrator</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Designated Job Title</label>
                            <input 
                                type="text" 
                                required
                                placeholder="e.g. Electrician"
                                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-peregrine-500 font-bold"
                                value={newUser.position}
                                onChange={(e) => setNewUser({...newUser, position: e.target.value})}
                            />
                        </div>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/40">
                        <p className="text-xs text-blue-800 dark:text-blue-200 font-medium leading-relaxed">
                            Temporary login password will be: <strong>Welcome123!</strong>. User will be prompted to reset upon first access.
                        </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-colors">Cancel</button>
                        <button type="submit" className="flex-1 py-4 bg-peregrine-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-peregrine-700 shadow-xl shadow-peregrine-100 dark:shadow-none transition-all active:scale-95">Activate User</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;