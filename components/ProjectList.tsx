import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Plus, MapPin, ArrowRight, Folder } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

const ProjectList = () => {
  const { projects, currentUser, addProject } = useApp();
  const [filter, setFilter] = useState<'all' | 'ongoing' | 'finished'>('ongoing');
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  // Form State
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectLocation, setNewProjectLocation] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  // Filter projects based on the new strict hierarchy requested:
  // 1. COO sees all created projects.
  // 2. PM only sees projects they personally created (as managerId).
  // 3. Employees see projects where they are explicitly assigned.
  const visibleProjects = projects.filter(p => {
    if (!currentUser) return false;
    
    // COO has global navigation/oversight
    if (currentUser.role === UserRole.COO) return true;
    
    // PM is restricted to viewing ONLY what they created
    if (currentUser.role === UserRole.MANAGER) {
         return p.managerId === currentUser.id;
    }
    
    // Employees and other roles (like HR) only see if assigned
    return p.assignedUserIds?.includes(currentUser.id);
  });

  const filteredProjects = visibleProjects.filter(p => filter === 'all' || p.status === filter);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    addProject({
      id: Math.random().toString(),
      name: newProjectName,
      location: newProjectLocation,
      status: 'ongoing',
      startDate: new Date().toISOString().split('T')[0],
      description: newProjectDescription || ('New project initialized by ' + currentUser.name),
      progress: 0,
      managerId: currentUser.id,
      imageUrl: 'https://picsum.photos/400/200',
      assignedUserIds: [currentUser.id] // Creator is auto-assigned
    });
    setShowAddModal(false);
    setNewProjectName('');
    setNewProjectLocation('');
    setNewProjectDescription('');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-peregrine-900 dark:text-white">Projects</h2>
          <p className="text-slate-500 dark:text-slate-400">Manage ongoing and completed sites</p>
        </div>
        {(currentUser?.role === UserRole.COO || currentUser?.role === UserRole.MANAGER) && (
            <button 
                onClick={() => setShowAddModal(true)}
                className="bg-peregrine-600 hover:bg-peregrine-700 text-white px-4 py-2 rounded-xl flex items-center shadow-md transition-colors"
            >
            <Plus size={20} className="mr-2" />
            New Project
            </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white dark:bg-slate-800 p-1 rounded-xl w-fit mb-6 shadow-sm border border-slate-200 dark:border-slate-700">
        {['ongoing', 'finished'].map((tab) => (
            <button
                key={tab}
                onClick={() => setFilter(tab as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === tab 
                    ? 'bg-peregrine-100 dark:bg-slate-600 text-peregrine-800 dark:text-white shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
            >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
        ))}
      </div>

      {filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              <Folder size={48} className="mx-auto mb-3 opacity-20 text-slate-400" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">No projects found.</p>
              <p className="text-sm text-slate-400 mt-1">
                  {currentUser?.role === UserRole.MANAGER 
                    ? "You haven't created any projects yet." 
                    : currentUser?.role === UserRole.EMPLOYEE 
                      ? "You haven't been assigned to any projects yet."
                      : "Create a new project to get started."}
              </p>
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-700 flex flex-col">
                <div className="h-40 bg-slate-200 dark:bg-slate-700 relative group cursor-pointer" onClick={() => navigate(`/projects/${project.id}`)}>
                    <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-900/90 px-2 py-1 rounded-md text-xs font-bold text-slate-800 dark:text-white backdrop-blur-sm">
                        {project.progress}% Complete
                    </div>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-peregrine-900 dark:text-white mb-1">{project.name}</h3>
                  <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mb-3">
                    <MapPin size={14} className="mr-1" />
                    {project.location}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">{project.description}</p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end items-center">
                     <button 
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="text-peregrine-600 dark:text-peregrine-400 font-medium text-sm flex items-center hover:underline"
                     >
                        View Details & Docs <ArrowRight size={14} className="ml-1" />
                     </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-200">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-6">Create New Project</h3>
                <form onSubmit={handleCreate} className="space-y-5">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Project Name</label>
                        <input 
                            type="text" 
                            required
                            placeholder="e.g. Skyline Apartments"
                            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-peregrine-500 font-bold"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Location</label>
                        <input 
                            type="text" 
                            required
                            placeholder="e.g. Downtown Manila"
                            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-peregrine-500 font-bold"
                            value={newProjectLocation}
                            onChange={(e) => setNewProjectLocation(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Description</label>
                        <textarea 
                            required
                            rows={3}
                            placeholder="Brief overview of project scope and objectives..."
                            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-peregrine-500 font-medium text-sm leading-relaxed"
                            value={newProjectDescription}
                            onChange={(e) => setNewProjectDescription(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-colors">Cancel</button>
                        <button type="submit" className="flex-1 py-4 bg-peregrine-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-peregrine-700 shadow-xl shadow-peregrine-100 dark:shadow-none transition-all active:scale-95">Create</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;