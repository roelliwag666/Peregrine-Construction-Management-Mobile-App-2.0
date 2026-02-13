
import { User, UserRole, Project, IncidentReport, FinancialRecord, IoTMetric, ProjectFolder, ProjectFile, Conversation, ChatMessage, ProjectDepartment, MaterialRequest, Notification, TimeLog, LeaveRequest, Announcement } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Althea Mendoza',
    email: 'coo@peregrine.com',
    role: UserRole.COO,
    position: 'Chief Operations Officer',
    avatar: 'https://picsum.photos/100/100?random=1',
    status: 'active',
    joinDate: '2023-01-01',
    about: 'Experienced COO with a demonstrated history of working in the construction industry.',
    certifications: [{ name: 'PMP Certification', expiry: '2026-01-01' }],
    resumeUrl: '#'
  },
  {
    id: 'u2',
    name: 'Sofia Mendoza',
    email: 'manager@peregrine.com',
    role: UserRole.MANAGER,
    position: 'Project Manager',
    avatar: 'https://picsum.photos/100/100?random=2',
    status: 'active',
    joinDate: '2023-02-15',
    about: 'Dedicated project manager focused on delivering results on time and within budget.',
    assignedEquipment: [{ id: 'eq1', name: 'iPad Pro', serialNumber: 'SN12345', dateIssued: '2023-02-20', status: 'issued' }],
    resumeUrl: '#'
  },
  {
    id: 'u3',
    name: 'Hana Minahal',
    email: 'hr@peregrine.com',
    role: UserRole.HR,
    position: 'HR Administrator',
    avatar: 'https://picsum.photos/100/100?random=3',
    status: 'active',
    joinDate: '2023-03-01',
    about: 'People-oriented HR professional managing talent acquisition and employee relations.',
    resumeUrl: '#'
  },
  {
    id: 'u4',
    name: 'John Doe',
    email: 'employee@peregrine.com',
    role: UserRole.EMPLOYEE,
    position: 'Site Engineer',
    avatar: 'https://picsum.photos/100/100?random=4',
    status: 'active',
    joinDate: '2024-01-10',
    about: 'Site engineer ensuring technical compliance and safety standards.',
    resumeUrl: '#'
  },
  {
    id: 'u5',
    name: 'Jane Smith',
    email: 'procurement@peregrine.com',
    role: UserRole.EMPLOYEE,
    position: 'Procurement Officer',
    avatar: 'https://picsum.photos/100/100?random=5',
    status: 'active',
    joinDate: '2024-02-01',
    resumeUrl: '#'
  },
  {
    id: 'u6',
    name: 'Mike Safety',
    email: 'hse@peregrine.com',
    role: UserRole.EMPLOYEE,
    position: 'HSE Officer',
    avatar: 'https://picsum.photos/100/100?random=6',
    status: 'active',
    joinDate: '2024-03-01',
    resumeUrl: '#'
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Riverside Commercial Complex',
    status: 'ongoing',
    location: 'Riverside Street, Downtown Area',
    startDate: '2025-06-01',
    description: 'Renovation of a 5-story commercial building including facade upgrades.',
    progress: 45,
    managerId: 'u2',
    imageUrl: 'https://picsum.photos/400/200?random=10',
    assignedUserIds: ['u2', 'u4', 'u6'] 
  }
];

const createStandardFolders = (projectId: string): ProjectFolder[] => {
  let folders: ProjectFolder[] = [];
  let idCounter = 1;

  const departments = [
    ProjectDepartment.SITE_MANAGEMENT,
    ProjectDepartment.HSE,
    ProjectDepartment.QA_QC,
    ProjectDepartment.PLANNING,
    ProjectDepartment.SURVEY,
    ProjectDepartment.HE_TRUCKS,
    ProjectDepartment.PROCUREMENT,
    ProjectDepartment.ADMIN_HR,
    ProjectDepartment.FINANCE,
    ProjectDepartment.COMMUNITY_RELATIONS
  ];
  
  departments.forEach(dept => {
    const deptId = `f_${projectId}_${idCounter++}`;
    let assigned: string[] = [];
    
    if (dept === ProjectDepartment.SITE_MANAGEMENT || 
        dept === ProjectDepartment.QA_QC || 
        dept === ProjectDepartment.PLANNING ||
        dept === ProjectDepartment.SURVEY ||
        dept === ProjectDepartment.HE_TRUCKS) {
        assigned.push('u4'); 
    }
    if (dept === ProjectDepartment.HSE) assigned.push('u6');
    if (dept === ProjectDepartment.PROCUREMENT) assigned.push('u5');

    folders.push({
      id: deptId,
      projectId,
      name: dept,
      department: dept,
      assignedUserIds: assigned
    });

    let subnames: string[] = [];
    switch(dept) {
      case ProjectDepartment.SITE_MANAGEMENT: subnames = ['Weekly Accomplishment Report', 'Two-Week Work Plan', 'Permits and Licenses', 'Variation Orders/Change Orders']; break;
      case ProjectDepartment.HSE: subnames = ['Health', 'Safety', 'Environment']; break;
      case ProjectDepartment.QA_QC: subnames = ['Activity Schedules', 'Test Results']; break;
      case ProjectDepartment.PLANNING: subnames = ['Work Schedules', 'Shop Drawings', 'As-built Plans']; break;
      case ProjectDepartment.SURVEY: subnames = ['Survey Activities', 'Survey Results']; break;
      case ProjectDepartment.HE_TRUCKS: subnames = ['Weekly Accomplishment Reports', 'Repair and Maintenance Schedule']; break;
      case ProjectDepartment.PROCUREMENT: subnames = ['PR', 'PO', 'DRs', 'Reports', 'Suppliers']; break;
      case ProjectDepartment.ADMIN_HR: subnames = ['Daily Time Sheet', 'Personnel', 'Admin']; break;
      case ProjectDepartment.FINANCE: subnames = ['Liquidations and Reimbursements', 'Reports']; break;
      case ProjectDepartment.COMMUNITY_RELATIONS: subnames = ['Community Requests and concerns', 'LGU Requests and concerns']; break;
    }

    subnames.forEach(sub => {
      folders.push({
        id: `f_${projectId}_${idCounter++}`,
        projectId,
        name: sub,
        parentId: deptId,
        assignedUserIds: [...assigned]
      });
    });
  });

  return folders;
};

export const MOCK_FOLDERS: ProjectFolder[] = createStandardFolders('p1');

export const MOCK_FILES: ProjectFile[] = [
  { id: 'fi1', folderId: 'f_p1_40', name: 'PR_001.pdf', url: '#', uploadDate: '2025-05-01', size: '2.4 MB', uploadedBy: 'u2' },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  { id: 'c1', partnerId: 'u2', lastMessage: 'Are we on schedule?', timestamp: '10:30 AM', unreadCount: 1 },
];

export const MOCK_MESSAGES: ChatMessage[] = [
  { id: 'm1', conversationId: 'c1', senderId: 'u2', text: 'Are we on schedule for the pour?', timestamp: '10:30 AM' },
];

export const MOCK_INCIDENTS: IncidentReport[] = [
  {
    id: 'i1',
    type: 'NEAR_MISS',
    description: 'Scaffolding felt unstable during high winds.',
    date: '2025-05-01',
    location: 'Riverside Site A',
    reporterId: 'u4',
    status: 'pending',
    replies: []
  }
];

export const MOCK_FINANCIALS: FinancialRecord[] = [
  { id: 'f1', date: '2025-05-01', description: 'Payment from Client A', category: 'Accounts Receivable', amount: 50000, type: 'income' },
];

export const MOCK_MATERIAL_REQUESTS: MaterialRequest[] = [
  {
    id: 'mr1',
    projectId: 'p1',
    requesterId: 'u4',
    description: 'Cement and Steel bars for Foundation A',
    dateSubmitted: '2025-05-10',
    status: 'MR_SUBMITTED',
    prImageUrl: 'https://picsum.photos/400/600',
    history: [
      { action: 'Submitted', actorId: 'u4', timestamp: '2025-05-10 09:00 AM' }
    ]
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', userId: 'u6', title: 'New Incident Reported', message: 'A Near Miss was reported at Riverside.', isRead: false, timestamp: '2025-05-10 09:00 AM', type: 'alert' }
];

export const MOCK_TIMELOGS: TimeLog[] = [
  { 
    id: 'tl1', userId: 'u4', date: '2025-05-10', 
    clockIn: '2025-05-10T08:00:00', locationIn: 'Riverside Site', 
    tasks: 'Supervising foundation pouring', status: 'pending' 
  }
];

export const MOCK_LEAVES: LeaveRequest[] = [
  { id: 'lr1', userId: 'u4', type: 'Vacation', startDate: '2025-06-01', endDate: '2025-06-05', reason: 'Family trip', status: 'pending' },
  { id: 'lr2', userId: 'u2', type: 'Sick', startDate: '2025-05-01', endDate: '2025-05-02', reason: 'Fever', status: 'approved', processedDate: '2025-05-01' }
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: 'an1', title: 'Company Outing', content: 'Annual team building will be held on Dec 15.', date: '2025-05-01', postedBy: 'HR' }
];

export const generateIoTData = (): IoTMetric[] => {
  const data: IoTMetric[] = [];
  const now = new Date();
  for (let i = 10; i >= 0; i--) {
    data.push({
      timestamp: new Date(now.getTime() - i * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temperature: 28 + Math.random() * 5,
      noiseLevel: 60 + Math.random() * 30,
      airQuality: 90 - Math.random() * 20,
      activeWorkers: 40 + Math.floor(Math.random() * 10)
    });
  }
  return data;
};
