
export enum UserRole {
  COO = 'COO',
  MANAGER = 'MANAGER',
  HR = 'HR',
  EMPLOYEE = 'EMPLOYEE'
}

export enum ProjectDepartment {
  SITE_MANAGEMENT = 'Site Management',
  HSE = 'Health, Safety, Environment (HSE)',
  QA_QC = 'Quality Assurance/Quality control (QA/QC)',
  PLANNING = 'Planning and Scheduling',
  SURVEY = 'Survey',
  HE_TRUCKS = 'HE, Trucks, and SV Operation and Maintenance',
  PROCUREMENT = 'Procurement',
  ADMIN_HR = 'Admin/HR',
  FINANCE = 'Finance',
  COMMUNITY_RELATIONS = 'Community Relations'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  position: string;
  avatar?: string;
  status: 'active' | 'resigned';
  joinDate: string;
  resignDate?: string;
  about?: string;
  phone?: string;
  emergencyContact?: string;
  certifications?: { name: string; expiry: string }[];
  assignedEquipment?: Equipment[];
  resumeUrl?: string;
}

export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  dateIssued: string;
  status: 'issued' | 'returned';
}

export interface Project {
  id: string;
  name: string;
  status: 'ongoing' | 'finished';
  location: string;
  startDate: string;
  endDate?: string;
  description: string;
  progress: number;
  managerId: string;
  imageUrl?: string;
  assignedUserIds: string[];
}

export interface ProjectActivity {
  id: string;
  projectId: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'project' | 'file' | 'folder' | 'team';
}

export interface ProjectFolder {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  department?: ProjectDepartment;
  parentId?: string;
  assignedUserIds: string[];
}

export interface ProjectFile {
  id: string;
  folderId: string;
  name: string;
  url: string;
  uploadDate: string;
  size: string;
  uploadedBy: string;
}

export type MaterialRequestStatus = 
  | 'MR_SUBMITTED' 
  | 'PROCUREMENT_CHECKED' 
  | 'PM_VERIFIED'
  | 'COO_APPROVED' 
  | 'PURCHASED' 
  | 'DELIVERED';

export interface MaterialRequest {
  id: string;
  projectId: string;
  requesterId: string;
  description: string;
  dateSubmitted: string;
  status: MaterialRequestStatus;
  prImageUrl?: string;
  poFileUrl?: string;
  history: {
    action: string;
    actorId: string;
    timestamp: string;
    comment?: string;
  }[];
}

export interface IncidentReply {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface IncidentReport {
  id: string;
  type: 'NEAR_MISS' | 'ACCIDENT' | 'SECURITY';
  description: string;
  date: string;
  location: string;
  reporterId: string;
  status: 'pending' | 'reviewed';
  replies: IncidentReply[];
}

export interface Conversation {
  id: string;
  partnerId: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface FinancialRecord {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
}

export interface IoTMetric {
  timestamp: string;
  temperature: number;
  noiseLevel: number;
  airQuality: number;
  activeWorkers: number;
}

export interface TimeLog {
  id: string;
  userId: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  locationIn: string;
  locationOut?: string;
  tasks: string;
  projectId?: string;
  status: 'pending' | 'approved' | 'rejected';
  overtimeHours?: number;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  type: 'Sick' | 'Vacation' | 'Emergency' | 'Other' | 'Service Incentive';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  hrComment?: string;
  processedDate?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  postedBy: string;
}

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    isRead: boolean;
    timestamp: string;
    type: 'alert' | 'info';
}
