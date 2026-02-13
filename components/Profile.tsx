
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Moon, Sun, Camera, Save, Mail, Calendar, Briefcase, User, Phone } from 'lucide-react';

const Profile = () => {
  const { currentUser, updateUserProfile, darkMode, toggleDarkMode } = useApp();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    avatar: currentUser?.avatar || '',
    about: currentUser?.about || '',
    phone: currentUser?.phone || '',
  });

  if (!currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
        name: formData.name,
        avatar: formData.avatar,
        about: formData.about,
        phone: formData.phone
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-peregrine-900 dark:text-white">My Profile</h2>
           <p className="text-slate-500 dark:text-slate-400">Manage your account settings and preferences</p>
        </div>
        <div className="flex items-center space-x-4">
             <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 p-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                 <button 
                    onClick={darkMode ? toggleDarkMode : undefined}
                    className={`p-2 rounded-full transition-all ${!darkMode ? 'bg-peregrine-100 text-peregrine-700 shadow-sm' : 'text-slate-400'}`}
                 >
                     <Sun size={18} />
                 </button>
                 <button 
                    onClick={!darkMode ? toggleDarkMode : undefined}
                    className={`p-2 rounded-full transition-all ${darkMode ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400'}`}
                 >
                     <Moon size={18} />
                 </button>
             </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        {/* Banner/Header */}
        <div className="h-32 bg-gradient-to-r from-peregrine-600 to-peregrine-400 dark:from-slate-700 dark:to-slate-800 relative">
        </div>
        
        <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
                 <div className="relative group">
                     <img 
                        src={formData.avatar} 
                        alt="Profile" 
                        className="w-32 h-32 rounded-2xl border-4 border-white dark:border-slate-800 shadow-md object-cover bg-slate-200"
                     />
                     {isEditing && (
                        <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera className="text-white" size={24} />
                        </div>
                     )}
                 </div>
                 
                 {!isEditing ? (
                     <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-peregrine-600 hover:bg-peregrine-700 text-white px-6 py-2 rounded-xl font-medium shadow-sm transition-colors"
                     >
                        Edit Profile
                     </button>
                 ) : (
                     <div className="flex space-x-2">
                        <button 
                            onClick={() => { setIsEditing(false); setFormData({ name: currentUser.name, avatar: currentUser.avatar || '', about: currentUser.about || '', phone: currentUser.phone || '' }); }}
                            className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl font-medium shadow-sm transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            className="bg-peregrine-600 hover:bg-peregrine-700 text-white px-6 py-2 rounded-xl font-medium shadow-sm transition-colors flex items-center"
                        >
                            <Save size={18} className="mr-2" />
                            Save Changes
                        </button>
                     </div>
                 )}
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column: Editable Info */}
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Full Name</label>
                        {isEditing ? (
                            <input 
                                type="text"
                                className="w-full text-2xl font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-peregrine-500"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        ) : (
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{currentUser.name}</h1>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">About Me</label>
                        {isEditing ? (
                            <textarea 
                                className="w-full text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-peregrine-500"
                                rows={4}
                                value={formData.about}
                                onChange={(e) => setFormData({...formData, about: e.target.value})}
                                placeholder="Write something about yourself..."
                            />
                        ) : (
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                {currentUser.about || "No bio added yet."}
                            </p>
                        )}
                    </div>

                    {isEditing && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Phone Number</label>
                                <input 
                                    type="text"
                                    className="w-full text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-peregrine-500"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    placeholder="+1 234 567 890"
                                />
                            </div>
                            <div>
                                 <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Avatar URL</label>
                                 <input 
                                    type="text"
                                    className="w-full text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-peregrine-500"
                                    value={formData.avatar}
                                    onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Read Only Info */}
                <div className="space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="bg-peregrine-100 dark:bg-slate-600 p-2 rounded-lg text-peregrine-600 dark:text-peregrine-300">
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">Position</p>
                                <p className="font-semibold text-slate-900 dark:text-white">{currentUser.position}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 mb-4">
                            <div className="bg-blue-100 dark:bg-slate-600 p-2 rounded-lg text-blue-600 dark:text-blue-300">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">Role</p>
                                <p className="font-semibold text-slate-900 dark:text-white">{currentUser.role}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 mb-4">
                            <div className="bg-purple-100 dark:bg-slate-600 p-2 rounded-lg text-purple-600 dark:text-purple-300">
                                <Mail size={20} />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">Email</p>
                                <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{currentUser.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 mb-4">
                            <div className="bg-green-100 dark:bg-slate-600 p-2 rounded-lg text-green-600 dark:text-green-300">
                                <Phone size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">Phone</p>
                                <p className="font-semibold text-slate-900 dark:text-white">{currentUser.phone || 'Not set'}</p>
                            </div>
                        </div>

                         <div className="flex items-center space-x-3">
                            <div className="bg-orange-100 dark:bg-slate-600 p-2 rounded-lg text-orange-600 dark:text-orange-300">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">Joined</p>
                                <p className="font-semibold text-slate-900 dark:text-white">{currentUser.joinDate}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
