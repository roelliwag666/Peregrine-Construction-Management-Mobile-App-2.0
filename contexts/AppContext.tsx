
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { User, Project, IncidentReport, UserRole, FinancialRecord, ProjectFolder, ProjectFile, Conversation, ChatMessage, MaterialRequest, MaterialRequestStatus, Notification, TimeLog, LeaveRequest, Announcement, ProjectActivity } from '../types';
import { MOCK_USERS, MOCK_PROJECTS, MOCK_INCIDENTS, MOCK_FINANCIALS, MOCK_FOLDERS, MOCK_FILES, MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_MATERIAL_REQUESTS, MOCK_NOTIFICATIONS, MOCK_TIMELOGS, MOCK_LEAVES, MOCK_ANNOUNCEMENTS } from '../services/mockData';

interface AppContextType {
  currentUser: User | null;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  
  users: User[];
  addUser: (user: User) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  resignUser: (userId: string) => void;

  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;

  activities: ProjectActivity[];
  recordActivity: (activity: Omit<ProjectActivity, 'id' | 'timestamp'>) => void;

  folders: ProjectFolder[];
  addFolder: (folder: ProjectFolder) => void;
  updateFolder: (folderId: string, updates: Partial<ProjectFolder>) => void;
  deleteFolder: (folderId: string) => void;
  assignUserToFolder: (folderId: string, userId: string) => void;
  removeUserFromFolder: (folderId: string, userId: string) => void;
  
  files: ProjectFile[];
  addFile: (file: ProjectFile) => void;
  deleteFile: (fileId: string) => void;
  
  conversations: Conversation[];
  messages: ChatMessage[];
  startConversation: (partnerId: string) => string;
  sendMessage: (conversationId: string, text: string) => void;

  incidents: IncidentReport[];
  addIncident: (incident: IncidentReport) => void;
  updateIncidentStatus: (id: string, status: 'pending' | 'reviewed') => void;
  replyToIncident: (incidentId: string, text: string) => void;
  
  financials: FinancialRecord[];
  
  materialRequests: MaterialRequest[];
  createMaterialRequest: (req: MaterialRequest) => void;
  updateMaterialRequestStatus: (id: string, newStatus: MaterialRequestStatus, actorId: string, actionLabel: string) => void;
  updateMaterialRequest: (id: string, updates: Partial<MaterialRequest>, historyEntry?: { action: string; actorId: string }) => void;

  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  sendNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;

  timeLogs: TimeLog[];
  clockIn: (userId: string, location: string) => void;
  clockOut: (userId: string, location: string, tasks: string) => void;
  approveTimeLog: (id: string) => void;
  
  leaveRequests: LeaveRequest[];
  submitLeaveRequest: (req: LeaveRequest) => void;
  updateLeaveStatus: (id: string, status: 'approved' | 'rejected', comment?: string) => void;

  announcements: Announcement[];
  addAnnouncement: (announcement: Announcement) => void;

  addAdminDoc: (doc: any) => void;

  darkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: PropsWithChildren) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [activities, setActivities] = useState<ProjectActivity[]>([]);
  const [folders, setFolders] = useState<ProjectFolder[]>(MOCK_FOLDERS);
  const [files, setFiles] = useState<ProjectFile[]>(MOCK_FILES);
  const [incidents, setIncidents] = useState<IncidentReport[]>(MOCK_INCIDENTS);
  const [financials] = useState<FinancialRecord[]>(MOCK_FINANCIALS);
  const [materialRequests, setMaterialRequests] = useState<MaterialRequest[]>(MOCK_MATERIAL_REQUESTS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>(MOCK_TIMELOGS);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(MOCK_LEAVES);
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);

  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const login = (email: string, role: UserRole) => {
    const user = users.find(u => u.email === email && u.status === 'active') || 
                 users.find(u => u.role === role && u.status === 'active');
    if (user) setCurrentUser(user);
    else alert("User not found or resigned.");
  };

  const logout = () => setCurrentUser(null);

  const updateUserProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const addUser = (user: User) => setUsers(prev => [...prev, user]);

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    if (currentUser && currentUser.id === userId) setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const resignUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'resigned', resignDate: new Date().toISOString().split('T')[0] } : u));
  };

  const recordActivity = (activityData: Omit<ProjectActivity, 'id' | 'timestamp'>) => {
    const newActivity: ProjectActivity = {
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toLocaleString(),
      ...activityData
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const addProject = (project: Project) => {
    setProjects(prev => [...prev, project]);
    if (currentUser) {
      recordActivity({ projectId: project.id, userId: currentUser.id, action: 'Created Project', details: `Project "${project.name}" was initialized.`, type: 'project' });
    }
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updates } : p));
    if (currentUser) {
      const p = projects.find(p => p.id === projectId);
      let actionLabel = updates.assignedUserIds ? 'Updated Team' : 'Edited Project';
      if (updates.status === 'finished') actionLabel = 'Project Completed';
      recordActivity({ projectId, userId: currentUser.id, action: actionLabel, details: `Project updated (${p?.name})`, type: updates.assignedUserIds ? 'team' : 'project' });
    }
  };

  const addFolder = (folder: ProjectFolder) => {
    setFolders(prev => [...prev, folder]);
    if (currentUser) recordActivity({ projectId: folder.projectId, userId: currentUser.id, action: 'Created Folder', details: `Folder "${folder.name}" created.`, type: 'folder' });
  };

  const updateFolder = (folderId: string, updates: Partial<ProjectFolder>) => {
    setFolders(prev => prev.map(f => f.id === folderId ? { ...f, ...updates } : f));
  };

  const deleteFolder = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return;
    setFolders(prev => prev.filter(f => f.id !== folderId && f.parentId !== folderId));
  };

  const assignUserToFolder = (folderId: string, userId: string) => {
    setFolders(prev => prev.map(f => f.id === folderId ? { ...f, assignedUserIds: [...(f.assignedUserIds || []), userId] } : f));
  };

  const removeUserFromFolder = (folderId: string, userId: string) => {
    setFolders(prev => prev.map(f => f.id === folderId ? { ...f, assignedUserIds: f.assignedUserIds?.filter(id => id !== userId) || [] } : f));
  };

  const addFile = (file: ProjectFile) => setFiles(prev => [...prev, file]);
  const deleteFile = (fileId: string) => setFiles(prev => prev.filter(f => f.id !== fileId));

  const createMaterialRequest = (req: MaterialRequest) => setMaterialRequests(prev => [req, ...prev]);

  const updateMaterialRequestStatus = (id: string, newStatus: MaterialRequestStatus, actorId: string, actionLabel: string) => {
    setMaterialRequests(prev => prev.map(req => req.id === id ? { ...req, status: newStatus, history: [...req.history, { action: actionLabel, actorId: actorId, timestamp: new Date().toLocaleString() }] } : req));
  };

  const updateMaterialRequest = (id: string, updates: Partial<MaterialRequest>, historyEntry?: { action: string; actorId: string }) => {
    setMaterialRequests(prev => prev.map(req => {
      if (req.id === id) {
        const updatedReq = { ...req, ...updates };
        if (historyEntry) updatedReq.history = [...req.history, { action: historyEntry.action, actorId: historyEntry.actorId, timestamp: new Date().toLocaleString() }];
        return updatedReq;
      }
      return req;
    }));
  };

  const startConversation = (partnerId: string) => {
    const existing = conversations.find(c => c.partnerId === partnerId);
    if (existing) return existing.id;
    const newConv: Conversation = { id: `c${Date.now()}`, partnerId, lastMessage: '', timestamp: new Date().toLocaleTimeString(), unreadCount: 0 };
    setConversations(prev => [newConv, ...prev]);
    return newConv.id;
  };

  const sendMessage = (conversationId: string, text: string) => {
    if (!currentUser) return;
    const newMessage: ChatMessage = { id: `m${Date.now()}`, conversationId, senderId: currentUser.id, text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newMessage]);
    setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, lastMessage: text, timestamp: newMessage.timestamp } : c));
  };

  const addIncident = (incident: IncidentReport) => {
    setIncidents(prev => [incident, ...prev]);
    const hseOfficers = users.filter(u => (u.position.includes('HSE') || u.position.includes('Safety')) && u.status === 'active');
    const newNotifications = hseOfficers.map(officer => ({ id: `n_${Date.now()}_${officer.id}`, userId: officer.id, title: 'New Incident Reported', message: `A ${incident.type.replace('_', ' ')} was reported.`, isRead: false, timestamp: new Date().toLocaleString(), type: 'alert' as const }));
    setNotifications(prev => [...newNotifications, ...prev]);
  };

  const updateIncidentStatus = (id: string, status: 'pending' | 'reviewed') => setIncidents(prev => prev.map(i => i.id === id ? { ...i, status } : i));

  const replyToIncident = (incidentId: string, text: string) => {
    if (!currentUser) return;
    setIncidents(prev => prev.map(inc => inc.id === incidentId ? { ...inc, replies: [...(inc.replies || []), { id: `rep_${Date.now()}`, senderId: currentUser.id, text, timestamp: new Date().toLocaleString() }] } : inc));
  };

  const markNotificationAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));

  const sendNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    setNotifications(prev => [{ id: `n_${Date.now()}`, timestamp: new Date().toLocaleString(), isRead: false, ...notificationData }, ...prev]);
  };

  const clockIn = (userId: string, location: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setTimeLogs(prev => [{ id: `tl_${Date.now()}`, userId, date: todayStr, clockIn: new Date().toISOString(), locationIn: location, tasks: '', status: 'pending' }, ...prev]);
  };

  const clockOut = (userId: string, location: string, tasks: string) => {
    setTimeLogs(prev => prev.map(log => (log.userId === userId && !log.clockOut) ? { ...log, clockOut: new Date().toISOString(), locationOut: location, tasks } : log));
  };

  const approveTimeLog = (id: string) => setTimeLogs(prev => prev.map(log => log.id === id ? { ...log, status: 'approved' } : log));

  const submitLeaveRequest = (req: LeaveRequest) => setLeaveRequests(prev => [req, ...prev]);

  const updateLeaveStatus = (id: string, status: 'approved' | 'rejected', hrComment?: string) => {
    setLeaveRequests(prev => prev.map(req => req.id === id ? { ...req, status, hrComment, processedDate: new Date().toISOString().split('T')[0] } : req));
  };

  const addAnnouncement = (announcement: Announcement) => setAnnouncements(prev => [announcement, ...prev]);

  const addAdminDoc = (doc: any) => console.log("Admin Doc added", doc);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <AppContext.Provider value={{
      currentUser, login, logout, updateUserProfile,
      users, addUser, updateUser, resignUser,
      projects, addProject, updateProject,
      activities, recordActivity,
      folders, addFolder, updateFolder, deleteFolder, assignUserToFolder, removeUserFromFolder,
      files, addFile, deleteFile,
      conversations, messages, startConversation, sendMessage,
      incidents, addIncident, updateIncidentStatus, replyToIncident,
      financials,
      materialRequests, createMaterialRequest, updateMaterialRequestStatus, updateMaterialRequest,
      notifications, markNotificationAsRead, sendNotification,
      timeLogs, clockIn, clockOut, approveTimeLog,
      leaveRequests, submitLeaveRequest, updateLeaveStatus,
      announcements, addAnnouncement,
      addAdminDoc,
      darkMode, toggleDarkMode
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
