import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { 
  ArrowLeft, Folder, FileText, Upload, Plus, UserPlus, 
  ChevronRight, AlertCircle, Trash2, Edit, Save, X, 
  Download, Users, CheckSquare, Square, Lock, 
  History, Archive, CheckCircle2, CalendarDays, UserCheck, Search, Camera, ShoppingCart,
  Clock, ArrowRight, Eye, ImageIcon, FileCheck, CheckCircle, ShieldAlert
} from 'lucide-react';
import { UserRole, ProjectFolder, ProjectFile, MaterialRequest, MaterialRequestStatus } from '../types';

const DocumentView = ({ projectId }: { projectId: string }) => {
    const { 
        folders, files, currentUser, users, 
        assignUserToFolder, removeUserFromFolder, 
        addFolder, updateFolder, addFile, deleteFile, deleteFolder, projects 
    } = useApp();
    
    const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);
    const [assigningFolderId, setAssigningFolderId] = useState<string | null>(null);
    const [showNewFolderModal, setShowNewFolderModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showEditFolderModal, setShowEditFolderModal] = useState(false);
    
    const [newFolderName, setNewFolderName] = useState('');
    const [newFolderDescription, setNewFolderDescription] = useState('');
    
    const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
    const [editFolderName, setEditFolderName] = useState('');
    const [editFolderDescription, setEditFolderDescription] = useState('');
    
    const [newFileName, setNewFileName] = useState('');

    const currentFolder = folders.find(f => f.id === currentFolderId);
    const project = projects.find(p => p.id === projectId);
    
    const levelFolders = folders.filter(f => 
        f.projectId === projectId && 
        f.parentId === currentFolderId
    );

    // Visible files include those in the current folder OR root-level files (mapped to projectId)
    const visibleFiles = files.filter(f => f.folderId === (currentFolderId || projectId));

    const checkAccess = (folder: ProjectFolder) => {
        if (!currentUser) return false;
        return currentUser.role === UserRole.COO || 
               currentUser.role === UserRole.MANAGER || 
               folder.assignedUserIds?.includes(currentUser.id);
    };

    // Managers/COO can perform administrative tasks (edit/delete/access)
    const canManage = currentUser?.role === UserRole.COO || currentUser?.role === UserRole.MANAGER;
    
    // UPDATED PERMISSION: All assigned employees can now create folders and upload files
    // If we are at root, anyone who can see the project can create. 
    // If in folder, anyone who can see the folder can create.
    const canCreate = canManage || (currentFolderId ? (currentFolder && checkAccess(currentFolder)) : true);

    const handleToggleFolderUser = (folderId: string, userId: string, isCurrentlyAssigned: boolean) => {
        if (isCurrentlyAssigned) {
            removeUserFromFolder(folderId, userId);
        } else {
            assignUserToFolder(folderId, userId);
        }
    };

    const handleCreateFolder = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFolderName.trim()) return;
        
        const folder: ProjectFolder = {
            id: `f_${Date.now()}`,
            projectId,
            name: newFolderName,
            description: newFolderDescription,
            parentId: currentFolderId,
            assignedUserIds: project?.assignedUserIds || []
        };
        
        addFolder(folder);
        setNewFolderName('');
        setNewFolderDescription('');
        setShowNewFolderModal(false);
    };

    const handleOpenEditModal = (folder: ProjectFolder) => {
        setEditingFolderId(folder.id);
        setEditFolderName(folder.name);
        setEditFolderDescription(folder.description || '');
        setShowEditFolderModal(true);
    };

    const handleUpdateFolder = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editFolderName.trim() || !editingFolderId) return;

        updateFolder(editingFolderId, {
            name: editFolderName,
            description: editFolderDescription
        });

        setShowEditFolderModal(false);
        setEditingFolderId(null);
        setEditFolderName('');
        setEditFolderDescription('');
    };

    const handleUploadFile = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFileName.trim()) return;

        const file: ProjectFile = {
            id: `fi_${Date.now()}`,
            folderId: currentFolderId || projectId, // Fallback to projectId for root uploads
            name: newFileName,
            url: '#',
            uploadDate: new Date().toISOString().split('T')[0],
            size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
            uploadedBy: currentUser?.id || 'unknown'
        };

        addFile(file);
        setNewFileName('');
        setShowUploadModal(false);
    };

    return (
        <div className="space-y-6">
            {/* Header & Breadcrumbs */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center text-xs font-black uppercase tracking-widest text-slate-400 overflow-x-auto no-scrollbar whitespace-nowrap">
                    {currentFolderId ? (
                        <button 
                            onClick={() => setCurrentFolderId(undefined)}
                            className="hover:text-peregrine-600 transition-colors flex items-center"
                        >
                            PROJECT ROOT
                        </button>
                    ) : (
                        <span className="text-peregrine-600">PROJECT ROOT</span>
                    )}
                    
                    {currentFolder && (
                        <>
                            <ChevronRight size={14} className="mx-2 shrink-0" />
                            <span className="text-slate-900 dark:text-white">{currentFolder.name}</span>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {currentFolderId && (
                        <button 
                            onClick={() => setCurrentFolderId(currentFolder?.parentId)}
                            className="flex items-center text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                        >
                            <ArrowLeft size={12} className="mr-1.5" /> Back
                        </button>
                    )}
                    {/* UPDATED: canCreate instead of canManage */}
                    {canCreate && (
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setShowNewFolderModal(true)}
                                className="flex items-center text-[10px] font-black uppercase tracking-widest bg-white dark:bg-slate-700 text-peregrine-600 dark:text-peregrine-400 border border-peregrine-200 dark:border-slate-600 px-3 py-1.5 rounded-lg hover:bg-peregrine-50 dark:hover:bg-slate-600 shadow-sm transition-all active:scale-95"
                            >
                                <Plus size={12} className="mr-1.5" /> New Folder
                            </button>
                            <button 
                                onClick={() => setShowUploadModal(true)}
                                className="flex items-center text-[10px] font-black uppercase tracking-widest bg-peregrine-600 text-white px-3 py-1.5 rounded-lg hover:bg-peregrine-700 shadow-sm transition-all active:scale-95"
                            >
                                <Upload size={12} className="mr-1.5" /> Upload File
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Folder Grid */}
            {levelFolders.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {levelFolders.map(folder => {
                        const hasAccess = checkAccess(folder);
                        return (
                            <div 
                                key={folder.id} 
                                onClick={() => hasAccess && setCurrentFolderId(folder.id)}
                                className={`relative group p-5 rounded-2xl border transition-all duration-200 ${
                                    hasAccess 
                                    ? 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-peregrine-300 dark:hover:border-peregrine-600 hover:shadow-lg cursor-pointer' 
                                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60 grayscale cursor-not-allowed'
                                }`}
                            >
                                <div className="flex flex-col items-start h-full">
                                    <div className={`mb-3 p-3 rounded-xl ${hasAccess ? 'bg-peregrine-50 dark:bg-peregrine-900/20 text-peregrine-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                        {hasAccess ? <Folder size={32} /> : <Lock size={32} />}
                                    </div>
                                    <div className="w-full pr-10">
                                        <h4 className={`text-sm font-bold line-clamp-1 leading-tight mb-1 ${hasAccess ? 'text-slate-800 dark:text-white' : 'text-slate-500'}`}>
                                            {folder.name}
                                        </h4>
                                        {folder.description && (
                                            <p className={`text-[11px] line-clamp-2 leading-relaxed ${hasAccess ? 'text-slate-500 dark:text-slate-400' : 'text-slate-400'}`}>
                                                {folder.description}
                                            </p>
                                        )}
                                    </div>
                                    
                                    {/* Action Buttons: Add User, Edit & Delete Folder (Only for PM/COO) */}
                                    {canManage && (
                                        <div className="absolute top-3 right-3 flex items-center gap-1">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setAssigningFolderId(folder.id);
                                                }}
                                                className="p-1.5 bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-peregrine-600 hover:bg-peregrine-50 dark:hover:bg-peregrine-900/40 rounded-lg transition-all"
                                                title="Manage Access"
                                            >
                                                <UserPlus size={16} />
                                            </button>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenEditModal(folder);
                                                }}
                                                className="p-1.5 bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-lg transition-all"
                                                title="Edit Folder"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (window.confirm(`Are you sure you want to delete the folder "${folder.name}"? All nested files and folders will be permanently removed.`)) {
                                                        deleteFolder(folder.id);
                                                    }
                                                }}
                                                className="p-1.5 bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-lg transition-all"
                                                title="Delete Folder"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}

                                    {!hasAccess && (
                                        <div className="absolute bottom-3 right-3">
                                            <span className="text-[8px] font-black uppercase tracking-tighter bg-slate-200 dark:bg-slate-700 text-slate-500 px-1.5 py-0.5 rounded">Restricted</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* File List */}
            {(visibleFiles.length > 0 || (levelFolders.length === 0 && currentFolderId)) && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30 flex justify-between items-center">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{currentFolderId ? 'Documents & Photos' : 'Root Documents'}</h3>
                        <span className="text-[10px] bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-bold">{visibleFiles.length} Items</span>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                        {visibleFiles.map(file => (
                            <div 
                                key={file.id} 
                                className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                            >
                                <div className="flex items-center min-w-0">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2.5 rounded-xl mr-4 text-blue-600 dark:text-blue-400">
                                        <FileText size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{file.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                            {file.size} • Uploaded {file.uploadDate}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <a 
                                        href={file.url} 
                                        className="p-3 text-peregrine-600 hover:bg-peregrine-50 dark:hover:bg-slate-700 rounded-xl transition-all"
                                        title="Download"
                                    >
                                        <Download size={20} />
                                    </a>
                                    <button 
                                        onClick={() => {
                                            if (window.confirm(`Are you sure you want to delete the file "${file.name}"?`)) {
                                                deleteFile(file.id);
                                            }
                                        }}
                                        className="p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                        title="Delete File"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {visibleFiles.length === 0 && (
                            <div className="p-16 text-center text-slate-400">
                                <Archive size={40} className="mx-auto mb-3 opacity-10" />
                                <p className="text-xs font-bold uppercase tracking-widest">No files in this directory</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Folder Access Modal */}
            {assigningFolderId && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-md shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-700/50">
                            <div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Manage Access</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Assign users to this folder</p>
                            </div>
                            <button onClick={() => setAssigningFolderId(null)} className="p-2 text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2 no-scrollbar">
                            {project?.assignedUserIds?.map(userId => {
                                const user = users.find(u => u.id === userId);
                                const folder = folders.find(f => f.id === assigningFolderId);
                                const isAssigned = folder?.assignedUserIds?.includes(userId);
                                const isManager = user?.role === UserRole.MANAGER || user?.role === UserRole.COO;

                                return (
                                    <div key={userId} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-600">
                                        <div className="flex items-center">
                                            <img src={user?.avatar} className="w-8 h-8 rounded-full mr-3 object-cover shadow-sm" alt="" />
                                            <div>
                                                <p className="text-xs font-bold text-slate-800 dark:text-white">{user?.name}</p>
                                                <p className="text-[9px] text-slate-500 font-medium uppercase">{user?.position}</p>
                                            </div>
                                        </div>
                                        {isManager ? (
                                            <span className="text-[8px] font-black uppercase tracking-tighter bg-peregrine-100 text-peregrine-700 px-2 py-1 rounded-lg">Admin Access</span>
                                        ) : (
                                            <button 
                                                onClick={() => handleToggleFolderUser(assigningFolderId, userId, !!isAssigned)}
                                                className={`flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                    isAssigned 
                                                    ? 'bg-peregrine-600 text-white shadow-md' 
                                                    : 'bg-white dark:bg-slate-600 text-slate-500 dark:text-slate-300 border dark:border-slate-500'
                                                }`}
                                            >
                                                {isAssigned ? <><UserCheck size={12} className="mr-1.5" /> Assigned</> : <><Plus size={12} className="mr-1.5" /> Add</>}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="p-6 border-t border-slate-100 dark:border-slate-700">
                            <button 
                                onClick={() => setAssigningFolderId(null)}
                                className="w-full py-3 bg-peregrine-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-peregrine-700 transition-all"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* New Folder Modal */}
            {showNewFolderModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-sm shadow-2xl p-8 border border-slate-100 dark:border-slate-700">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">Create New Folder</h3>
                        <form onSubmit={handleCreateFolder} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Folder Name</label>
                                <input 
                                    autoFocus
                                    type="text" 
                                    className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-peregrine-500 font-bold mb-4"
                                    placeholder="Enter folder name..."
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                />
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Description (Optional)</label>
                                <textarea 
                                    className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-peregrine-500 font-medium text-sm leading-relaxed"
                                    placeholder="Briefly describe the contents of this folder..."
                                    rows={3}
                                    value={newFolderDescription}
                                    onChange={(e) => setNewFolderDescription(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => {setShowNewFolderModal(false); setNewFolderName(''); setNewFolderDescription('');}} className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-colors">Cancel</button>
                                <button type="submit" disabled={!newFolderName.trim()} className="flex-1 py-4 bg-peregrine-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-peregrine-700 disabled:opacity-50 transition-all">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Folder Modal */}
            {showEditFolderModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-sm shadow-2xl p-8 border border-slate-100 dark:border-slate-700">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">Edit Folder</h3>
                        <form onSubmit={handleUpdateFolder} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Folder Name</label>
                                <input 
                                    autoFocus
                                    type="text" 
                                    className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-peregrine-500 font-bold mb-4"
                                    placeholder="Enter folder name..."
                                    value={editFolderName}
                                    onChange={(e) => setEditFolderName(e.target.value)}
                                />
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Description (Optional)</label>
                                <textarea 
                                    className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-peregrine-500 font-medium text-sm leading-relaxed"
                                    placeholder="Briefly describe the contents of this folder..."
                                    rows={3}
                                    value={editFolderDescription}
                                    onChange={(e) => setEditFolderDescription(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => {setShowEditFolderModal(false); setEditingFolderId(null);}} className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-colors">Cancel</button>
                                <button type="submit" disabled={!editFolderName.trim()} className="flex-1 py-4 bg-peregrine-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-peregrine-700 disabled:opacity-50 transition-all">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Upload File Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-sm shadow-2xl p-8 border border-slate-100 dark:border-slate-700">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">Upload Document</h3>
                        <form onSubmit={handleUploadFile} className="space-y-4">
                            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-900/30">
                                <Upload size={32} className="mb-2" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Select Image or Document</span>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Display Name</label>
                                <input 
                                    autoFocus
                                    type="text" 
                                    className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-peregrine-500 font-bold"
                                    placeholder="e.g. Weekly Report Oct-W4"
                                    value={newFileName}
                                    onChange={(e) => setNewFileName(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowUploadModal(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-colors">Cancel</button>
                                <button type="submit" disabled={!newFileName.trim()} className="flex-1 py-4 bg-peregrine-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-peregrine-700 disabled:opacity-50 transition-all">Upload</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const MaterialRequestView = ({ projectId }: { projectId: string }) => {
    const { materialRequests, currentUser, updateMaterialRequestStatus, createMaterialRequest, users, updateMaterialRequest } = useApp();
    const [showNewRequestModal, setShowNewRequestModal] = useState(false);
    const [viewRequestId, setViewRequestId] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    
    // New Request State
    const [description, setDescription] = useState('');
    const [prImage, setPrImage] = useState<string | null>(null);

    const projectRequests = materialRequests.filter(r => r.projectId === projectId);
    
    // Role & Position Checks for the new Linear flow
    const position = currentUser?.position.toLowerCase() || '';
    const isSiteManager = position.includes('site manager') || position.includes('site engineer');
    const isHSE = position.includes('hse') || position.includes('safety');
    const isProcurement = position.includes('procurement');
    const isPM = currentUser?.role === UserRole.MANAGER;
    const isCOO = currentUser?.role === UserRole.COO;

    const handleCreateRequest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !description.trim()) return;

        const roleLabel = isHSE ? '(HSE Officer)' : '(Site Manager)';
        const newReq: MaterialRequest = {
            id: `MR-${Date.now()}`,
            projectId,
            requesterId: currentUser.id,
            description,
            dateSubmitted: new Date().toISOString().split('T')[0],
            status: 'MR_SUBMITTED',
            prImageUrl: prImage || undefined,
            history: [{
                action: `Submitted Request ${roleLabel}`,
                actorId: currentUser.id,
                timestamp: new Date().toLocaleString()
            }]
        };

        createMaterialRequest(newReq);
        setDescription('');
        setPrImage(null);
        setShowNewRequestModal(false);
    };

    const handleUploadSim = (type: 'PR' | 'PO') => {
        setIsUploading(true);
        setTimeout(() => {
            const mockUrl = `https://picsum.photos/400/600?random=${Date.now()}`;
            if (type === 'PR') setPrImage(mockUrl);
            setIsUploading(false);
        }, 1000);
    };

    const handleAction = (reqId: string, status: MaterialRequestStatus, label: string) => {
        if (!currentUser) return;
        updateMaterialRequestStatus(reqId, status, currentUser.id, label);
    };

    const getStatusColor = (status: MaterialRequestStatus) => {
        switch(status) {
            case 'MR_SUBMITTED': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'PROCUREMENT_CHECKED': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'PM_VERIFIED': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'COO_APPROVED': return 'bg-green-100 text-green-700 border-green-200';
            case 'PURCHASED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'DELIVERED': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const activeRequest = materialRequests.find(r => r.id === viewRequestId);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Material Requests</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Site Management Flow</p>
                </div>
                {(isSiteManager || isHSE) && (
                    <button 
                        onClick={() => setShowNewRequestModal(true)}
                        className="flex items-center px-4 py-2 bg-peregrine-600 text-white rounded-xl text-sm font-bold hover:bg-peregrine-700 shadow-lg shadow-peregrine-100 dark:shadow-none transition-all active:scale-95"
                    >
                        <Plus size={18} className="mr-2" /> {isHSE ? 'Request HSE Materials' : 'Create Request'}
                    </button>
                )}
            </div>

            {projectRequests.length === 0 ? (
                <div className="p-16 text-center bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                    <ShoppingCart size={48} className="mx-auto mb-4 text-slate-200" />
                    <p className="text-slate-400 font-medium tracking-tight">No active material requests for this project.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projectRequests.map(req => (
                        <div key={req.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-peregrine-300 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1 pr-4">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{req.description}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">REF: {req.id}</span>
                                        <span className="text-[10px] text-slate-400">•</span>
                                        <span className="text-[10px] text-slate-400 font-bold">{req.dateSubmitted}</span>
                                    </div>
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${getStatusColor(req.status)}`}>
                                    {req.status.replace(/_/g, ' ')}
                                </span>
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700">
                                <div className="flex -space-x-2">
                                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                        {users.find(u => u.id === req.requesterId)?.name.charAt(0)}
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setViewRequestId(req.id)}
                                    className="flex items-center text-[10px] font-black uppercase tracking-widest text-peregrine-600 hover:text-peregrine-700 transition-colors"
                                >
                                    View Details <ArrowRight size={14} className="ml-1" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* New Request Modal */}
            {showNewRequestModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-lg shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 animate-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-700/50">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">New {isHSE ? 'HSE Material' : 'Material'} Requisition</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{isHSE ? 'Safety & Compliance Request Form' : 'Site Manager Request Form'}</p>
                            </div>
                            <button onClick={() => setShowNewRequestModal(false)} className="p-2 text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateRequest} className="p-8 space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{isHSE ? 'HSE Items & Quantity' : 'Item Description & Quantity'}</label>
                                <textarea 
                                    required
                                    className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-peregrine-500 font-medium text-sm leading-relaxed"
                                    placeholder={isHSE ? "e.g. 20 sets of Safety Harnesses, 50 sets of PPE vests..." : "e.g. 50 bags of Portland Cement, 20 lengths of 12mm Rebar..."}
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Supporting Document Photo</label>
                                {!prImage ? (
                                    <button 
                                        type="button"
                                        onClick={() => handleUploadSim('PR')}
                                        className="w-full py-10 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-all group"
                                    >
                                        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                            {isUploading ? <Clock size={24} className="animate-spin text-peregrine-600" /> : <Camera size={24} />}
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-widest">{isUploading ? 'Capturing...' : 'Upload Reference Photo'}</span>
                                    </button>
                                ) : (
                                    <div className="relative rounded-2xl overflow-hidden border-2 border-peregrine-500 shadow-lg group">
                                        <img src={prImage} className="w-full h-48 object-cover" alt="PR Preview" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button type="button" onClick={() => setPrImage(null)} className="p-3 bg-red-600 text-white rounded-full"><Trash2 size={20} /></button>
                                        </div>
                                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-black uppercase text-peregrine-600">Captured Image</div>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowNewRequestModal(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-black text-xs uppercase tracking-widest rounded-2xl">Cancel</button>
                                <button type="submit" disabled={!description.trim() || !prImage} className="flex-1 py-4 bg-peregrine-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-peregrine-700 shadow-xl shadow-peregrine-100 transition-all disabled:opacity-50">Submit Request</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Details / Flow Modal */}
            {viewRequestId && activeRequest && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 flex flex-col animate-in slide-in-from-bottom-4 duration-300">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-peregrine-600 text-white rounded-lg">
                                    <ShoppingCart size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Flow Status: {activeRequest.id}</h3>
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${getStatusColor(activeRequest.status)}`}>
                                        {activeRequest.status.replace(/_/g, ' ')}
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => setViewRequestId(null)} className="p-2 text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="bg-slate-50 dark:bg-slate-900/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Request Description</h4>
                                        <p className="text-slate-800 dark:text-slate-200 text-lg font-bold leading-tight">{activeRequest.description}</p>
                                        <div className="flex items-center gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center gap-2">
                                                <img src={users.find(u => u.id === activeRequest.requesterId)?.avatar} className="w-8 h-8 rounded-full" alt="" />
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase">Requester</p>
                                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{users.find(u => u.id === activeRequest.requesterId)?.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center">
                                                <ImageIcon size={14} className="mr-2" /> Reference Document
                                            </h4>
                                            {activeRequest.prImageUrl ? (
                                                <div className="relative rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm group">
                                                    <img src={activeRequest.prImageUrl} className="w-full h-48 object-cover" alt="PR" />
                                                </div>
                                            ) : (
                                                <div className="h-48 bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 font-bold uppercase text-[10px]">No Attachment</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* LINEAR FLOW ACTIONS - UPDATED */}
                                    <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Flow Control</h4>
                                        <div className="flex flex-wrap gap-4">
                                            {isProcurement && activeRequest.status === 'MR_SUBMITTED' && (
                                                <button onClick={() => handleAction(activeRequest.id, 'PROCUREMENT_CHECKED', 'Checked & Validated (Procurement Officer)')} className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase shadow-lg transition-all hover:bg-indigo-700">
                                                    <CheckCircle size={18} className="mr-2" /> Procurement Check & Approve
                                                </button>
                                            )}
                                            {isPM && activeRequest.status === 'PROCUREMENT_CHECKED' && (
                                                <button onClick={() => handleAction(activeRequest.id, 'PM_VERIFIED', 'Verified Legitimacy (Project Manager)')} className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-xl text-xs font-black uppercase shadow-lg transition-all hover:bg-orange-700">
                                                    <ShieldAlert size={18} className="mr-2" /> Verify Legitimacy (PM)
                                                </button>
                                            )}
                                            {isCOO && activeRequest.status === 'PM_VERIFIED' && (
                                                <button onClick={() => handleAction(activeRequest.id, 'COO_APPROVED', 'Final Purchase Confirmation (COO)')} className="flex items-center px-6 py-3 bg-green-600 text-white rounded-xl text-xs font-black uppercase shadow-lg transition-all hover:bg-green-700">
                                                    <CheckCircle2 size={18} className="mr-2" /> COO Final Purchase Confirm
                                                </button>
                                            )}
                                            {(isProcurement || isCOO) && activeRequest.status === 'COO_APPROVED' && (
                                                <button onClick={() => handleAction(activeRequest.id, 'PURCHASED', 'Marked as Purchased')} className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase shadow-lg transition-all hover:bg-emerald-700">
                                                    <ShoppingCart size={18} className="mr-2" /> Mark as Purchased
                                                </button>
                                            )}
                                            {(isSiteManager || isHSE) && activeRequest.status === 'PURCHASED' && (
                                                <button onClick={() => handleAction(activeRequest.id, 'DELIVERED', 'Confirmed Received at Site')} className="flex items-center px-6 py-3 bg-slate-700 text-white rounded-xl text-xs font-black uppercase shadow-lg transition-all hover:bg-slate-800">
                                                    <CheckCircle size={18} className="mr-2" /> Confirm Site Delivery
                                                </button>
                                            )}
                                        </div>
                                        {!isSiteManager && !isProcurement && !isPM && !isCOO && !isHSE && (
                                            <p className="text-xs text-slate-400 italic">This module is currently read-only for your role.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 flex flex-col">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center">
                                        <History size={16} className="mr-2" /> Approval Audit Log
                                    </h4>
                                    <div className="flex-1 space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                                        {activeRequest.history.slice().reverse().map((step, idx) => (
                                            <div key={idx} className="relative pl-8 animate-in fade-in slide-in-from-left-2" style={{ animationDelay: `${idx * 100}ms` }}>
                                                <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-slate-50 dark:border-slate-900 z-10 flex items-center justify-center ${idx === 0 ? 'bg-peregrine-600 shadow-md' : 'bg-slate-300'}`}>
                                                    {idx === 0 && <CheckCircle size={10} className="text-white" />}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className={`text-sm font-black uppercase tracking-tight ${idx === 0 ? 'text-peregrine-600' : 'text-slate-700 dark:text-slate-300'}`}>{step.action}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                                        {users.find(u => u.id === step.actorId)?.name} • {step.timestamp}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ActivityView = ({ projectId }: { projectId: string }) => {
    const { activities, users } = useApp();
    const projectActivities = activities.filter(a => a.projectId === projectId);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {projectActivities.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 italic">No project activity logs found.</div>
                ) : (
                    projectActivities.map(act => {
                        const user = users.find(u => u.id === act.userId);
                        return (
                            <div key={act.id} className="p-4 flex items-start">
                                <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg mr-4 text-slate-500">
                                    <History size={16} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-800 dark:text-white">{act.action}</p>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{act.details}</p>
                                    <p className="text-[9px] text-slate-400 mt-1 uppercase font-black">{act.timestamp} • {user?.name}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { 
    projects, users, currentUser, 
    updateProject
  } = useApp();

  const project = projects.find(p => p.id === projectId);
  const [activeTab, setActiveTab] = useState<'documents' | 'materials' | 'activity'>('documents');
  
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editForm, setEditForm] = useState({
      name: '',
      location: '',
      description: ''
  });

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamSearch, setTeamSearch] = useState('');

  useEffect(() => {
      if (project) {
          setEditForm({
              name: project.name,
              location: project.location,
              description: project.description
          });
      }
  }, [project]);

  if (!project || !currentUser) return <div>Project not found</div>;

  const position = currentUser.position.toLowerCase();
  const role = currentUser.role;

  const hasAccess = 
    currentUser.role === UserRole.COO || 
    (currentUser.role === UserRole.MANAGER && project.managerId === currentUser.id) || 
    (currentUser.role !== UserRole.MANAGER && project.assignedUserIds?.includes(currentUser.id));

  if (!hasAccess) {
      return (
          <div className="flex flex-col items-center justify-center h-64 text-center">
              <AlertCircle size={48} className="text-red-500 mb-4" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Access Denied</h2>
              <p className="text-slate-500 mb-4">
                  {currentUser.role === UserRole.MANAGER 
                    ? "You did not create this project." 
                    : "You have not been added to this project."}
              </p>
              <button onClick={() => navigate('/projects')} className="text-blue-600 hover:underline">Return to Projects</button>
          </div>
      );
  }

  // UPDATED MATERIAL REQUEST ACCESS: Site Manager, HSE, Procurement, PM, COO
  const isSiteManager = position.includes('site manager') || position.includes('site engineer');
  const isHSE = position.includes('hse') || position.includes('safety');
  const isProcurement = position.includes('procurement');
  const isPM = role === UserRole.MANAGER;
  const isCOO = role === UserRole.COO;
  const canAccessMaterialRequests = isSiteManager || isHSE || isProcurement || isPM || isCOO;

  const canManage = currentUser.role === UserRole.COO || currentUser.role === UserRole.MANAGER;
  const isActualManager = currentUser.id === project.managerId || currentUser.role === UserRole.COO;

  const handleSaveProject = () => {
      updateProject(project.id, editForm);
      setIsEditingProject(false);
  };

  const handleFinishProject = () => {
    if (window.confirm(`Are you sure you want to mark "${project.name}" as FINISHED?`)) {
        updateProject(project.id, { status: 'finished', progress: 100 });
        alert("Project successfully completed.");
    }
  };

  const toggleTeamMember = (userId: string) => {
      if (!project.assignedUserIds) return;
      const currentIds = project.assignedUserIds;
      let newIds;
      if (currentIds.includes(userId)) {
          newIds = currentIds.filter(id => id !== userId);
      } else {
          newIds = [...currentIds, userId];
      }
      updateProject(project.id, { assignedUserIds: newIds });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
        <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 w-full">
                <button onClick={() => navigate('/projects')} className="p-2 mt-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex-shrink-0">
                  <ArrowLeft size={24} />
                </button>
                
                {isEditingProject ? (
                    <div className="w-full space-y-3">
                        <input className="w-full text-2xl font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-peregrine-500" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} placeholder="Project Name" />
                        <input className="w-full text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-peregrine-500" value={editForm.location} onChange={(e) => setEditForm({...editForm, location: e.target.value})} placeholder="Location" />
                        <textarea className="w-full text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-peregrine-500" value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} placeholder="Description" rows={3} />
                        <div className="flex space-x-2 pt-1">
                             <button onClick={handleSaveProject} className="flex items-center px-4 py-2 bg-peregrine-600 text-white rounded-lg text-sm hover:bg-peregrine-700"><Save size={16} className="mr-2"/> Save Changes</button>
                             <button onClick={() => setIsEditingProject(false)} className="flex items-center px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm hover:bg-slate-300 dark:hover:bg-slate-600"><X size={16} className="mr-2"/> Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center">
                                    <h1 className="text-2xl font-bold text-peregrine-900 dark:text-white mr-3">{project.name}</h1>
                                    {canManage && (
                                        <button onClick={() => setIsEditingProject(true)} className="text-slate-400 hover:text-peregrine-600 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700" title="Edit Details">
                                            <Edit size={18} />
                                        </button>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                                    <p className="text-slate-500 dark:text-slate-400 flex items-center text-sm font-medium">
                                        <span className={`w-2 h-2 rounded-full mr-2 ${project.status === 'ongoing' ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                                        {project.location}
                                    </p>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${project.status === 'finished' ? 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600' : 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'}`}>
                                        {project.status}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                {isActualManager && project.status === 'ongoing' && (
                                    <button 
                                        onClick={handleFinishProject}
                                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 shadow-lg shadow-green-100 dark:shadow-none transition-all active:scale-95"
                                    >
                                        <CheckCircle2 size={18} className="mr-2" />
                                        Finish Project
                                    </button>
                                )}
                                {canManage && (
                                    <button onClick={() => setShowTeamModal(true)} className="flex items-center px-4 py-2 bg-peregrine-100 dark:bg-slate-700 text-peregrine-800 dark:text-slate-200 rounded-xl text-sm font-medium hover:bg-peregrine-200 dark:hover:bg-slate-600 transition-colors">
                                        <Users size={18} className="mr-2" />
                                        Team
                                    </button>
                                )}
                            </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-sm mt-3 max-w-3xl leading-relaxed">{project.description}</p>
                    </div>
                )}
            </div>
        </div>
      </div>

      <div className="flex space-x-1 bg-white dark:bg-slate-800 p-1 rounded-xl w-fit shadow-sm border border-slate-200 dark:border-slate-700">
        <button onClick={() => setActiveTab('documents')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${activeTab === 'documents' ? 'bg-peregrine-100 dark:bg-slate-600 text-peregrine-800 dark:text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
            <Folder size={16} className="mr-2" /> Documents
        </button>
        {canAccessMaterialRequests && (
          <button onClick={() => setActiveTab('materials')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${activeTab === 'materials' ? 'bg-peregrine-100 dark:bg-slate-600 text-peregrine-800 dark:text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
              <ShoppingCart size={16} className="mr-2" /> Material Request
          </button>
        )}
        <button onClick={() => setActiveTab('activity')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${activeTab === 'activity' ? 'bg-peregrine-100 dark:bg-slate-600 text-peregrine-800 dark:text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
            <History size={16} className="mr-2" /> Activity Log
        </button>
      </div>

      {activeTab === 'documents' && <DocumentView projectId={project.id} />}
      {activeTab === 'materials' && canAccessMaterialRequests && <MaterialRequestView projectId={project.id} />}
      {activeTab === 'activity' && <ActivityView projectId={project.id} />}

      {showTeamModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg p-6 flex flex-col max-h-[80vh]">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center"><Users size={24} className="mr-2 text-peregrine-600" /> Project Team Members</h3>
                      <button onClick={() => setShowTeamModal(false)} className="text-slate-500 hover:text-slate-700"><X size={24} /></button>
                  </div>
                  <div className="relative mb-4">
                      <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input className="w-full pl-10 p-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-peregrine-500" placeholder="Search employees..." value={teamSearch} onChange={e => setTeamSearch(e.target.value)} />
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                      {users.filter(u => u.status === 'active' && u.name.toLowerCase().includes(teamSearch.toLowerCase())).map(user => {
                            const isAssigned = project.assignedUserIds?.includes(user.id);
                            const isManager = project.managerId === user.id;
                            return (
                                <div key={user.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <div className="flex items-center">
                                        <img src={user.avatar} className="w-10 h-10 rounded-full mr-3 object-cover shadow-sm" alt="" />
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white text-sm">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.position} • {user.role}</p>
                                        </div>
                                    </div>
                                    <div>{isManager ? <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-bold">Manager</span> : <button onClick={() => toggleTeamMember(user.id)} className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isAssigned ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'}`}>{isAssigned ? <><CheckSquare size={16} className="mr-1" /> Added</> : <><Square size={16} className="mr-1" /> Add</>}</button>}</div>
                                </div>
                            );
                        })}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 text-center text-xs text-slate-400">Users added here will see this project in their dashboard.</div>
              </div>
          </div>
      )}
    </div>
  );
};

export default ProjectDetails;