
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Megaphone, Calendar, User } from 'lucide-react';
import { UserRole } from '../types';

const Announcements = () => {
  const { announcements, addAnnouncement, currentUser } = useApp();
  
  // Announcement Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Check if user can post announcements (HR, COO, or MANAGER)
  const canPost = currentUser?.role === UserRole.HR || currentUser?.role === UserRole.COO || currentUser?.role === UserRole.MANAGER;

  const handleAddAnnouncement = (e: React.FormEvent) => {
      e.preventDefault();
      addAnnouncement({
          id: `an_${Date.now()}`,
          title: annTitle,
          content: annContent,
          date: new Date().toISOString().split('T')[0],
          postedBy: currentUser?.name || 'Admin'
      });
      setAnnTitle('');
      setAnnContent('');
      setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-peregrine-900 dark:text-white">Company Announcements</h2>
            <p className="text-slate-500 dark:text-slate-400">Latest news, updates, and memos</p>
          </div>
          {canPost && (
              <button 
                onClick={() => setShowForm(!showForm)}
                className="bg-peregrine-600 hover:bg-peregrine-700 text-white px-4 py-2 rounded-xl flex items-center shadow-md transition-colors"
              >
                  <Megaphone size={18} className="mr-2" />
                  {showForm ? 'Cancel' : 'Post New'}
              </button>
          )}
      </div>

      {/* Post Form (Restricted) */}
      {showForm && canPost && (
           <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 mb-6 animate-fade-in">
              <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Create Announcement</h3>
              <form onSubmit={handleAddAnnouncement} className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium mb-1 dark:text-slate-300">Title</label>
                      <input 
                        required 
                        className="w-full p-3 border rounded-xl bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-peregrine-500 outline-none" 
                        value={annTitle} 
                        onChange={e => setAnnTitle(e.target.value)} 
                        placeholder="e.g., Annual Team Building"
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium mb-1 dark:text-slate-300">Content</label>
                      <textarea 
                        required 
                        rows={4} 
                        className="w-full p-3 border rounded-xl bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-peregrine-500 outline-none" 
                        value={annContent} 
                        onChange={e => setAnnContent(e.target.value)} 
                        placeholder="Write the announcement details here..."
                      />
                  </div>
                  <div className="flex justify-end">
                      <button type="submit" className="bg-peregrine-600 text-white py-2 px-6 rounded-xl font-medium hover:bg-peregrine-700 flex items-center">
                          <Megaphone size={18} className="mr-2" /> Publish
                      </button>
                  </div>
              </form>
           </div>
      )}

      {/* Announcement List */}
      <div className="space-y-4">
           {announcements.length === 0 ? (
               <div className="text-center py-10 text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                   <Megaphone size={48} className="mx-auto mb-2 opacity-20" />
                   <p>No announcements yet.</p>
               </div>
           ) : (
               announcements.map(ann => (
                   <div key={ann.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 transition-transform hover:scale-[1.01]">
                       <div className="flex justify-between items-start mb-3">
                           <h4 className="font-bold text-slate-900 dark:text-white text-xl">{ann.title}</h4>
                           <div className="flex items-center text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg">
                               <Calendar size={12} className="mr-1" />
                               {ann.date}
                           </div>
                       </div>
                       <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{ann.content}</p>
                       <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-700 flex items-center text-xs text-slate-500 dark:text-slate-400">
                           <User size={12} className="mr-1" />
                           Posted by: <span className="font-medium ml-1 text-slate-700 dark:text-slate-200">{ann.postedBy}</span>
                       </div>
                   </div>
               ))
           )}
      </div>
    </div>
  );
};

export default Announcements;
