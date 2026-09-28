export interface ServerUser {
  id: number;
  fullName: string;
  email: string;
  mobileNumber: string;
  password?: string;
  pin?: string;
  role: 'FARMER' | 'WORKER' | 'ADMIN';
  language: string;
  villageOrTown: string;
  district: string;
  state: string;
  avatar?: string;
  farmSizeAcres?: number;
  mainCrops?: string[];
  skills?: string[];
  experienceYears?: number;
  dailyWageExpected?: number;
  reliabilityScore?: number;
  rating?: number;
  reviewCount?: number;
  availabilityStatus?: 'AVAILABLE' | 'BUSY' | 'PARTIALLY_AVAILABLE';
  bio?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface ServerOtp {
  mobileOrEmail: string;
  otpCode: string;
  expiresAt: number;
  attempts: number;
  verified: boolean;
}

export interface ServerDispute {
  id: string;
  jobId: number;
  jobTitle: string;
  complainantName: string;
  complainantRole: 'FARMER' | 'WORKER';
  againstName: string;
  againstRole: 'FARMER' | 'WORKER';
  issue: string;
  category: 'WAGE_PAYMENT' | 'ATTENDANCE' | 'QUALITY_OF_WORK' | 'BEHAVIOR';
  amountDisputed?: number;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
  resolutionNote?: string;
}

export const INITIAL_SERVER_USERS: ServerUser[] = [
  {
    id: 1,
    fullName: 'Ramesh K. (Murugan Farms)',
    email: 'ramesh.farmer@farmconnect.in',
    mobileNumber: '+919840123456',
    password: 'Password@123',
    pin: '1234',
    role: 'FARMER',
    language: 'ta',
    villageOrTown: 'Thiruvaiyaru',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    farmSizeAcres: 5.5,
    mainCrops: ['Paddy', 'Sugarcane'],
    isVerified: true,
    isActive: true,
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 201,
    fullName: 'Murugesan V.',
    email: 'murugesan.v@farmconnect.in',
    mobileNumber: '+919840567890',
    password: 'Password@123',
    pin: '1234',
    role: 'WORKER',
    language: 'ta',
    villageOrTown: 'Thiruvaiyaru',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    skills: ['Harvesting', 'Paddy work', 'Bundling', 'Tractor operation'],
    experienceYears: 7,
    dailyWageExpected: 750,
    reliabilityScore: 96,
    rating: 4.9,
    reviewCount: 22,
    availabilityStatus: 'AVAILABLE',
    bio: 'Punctual, hardworking agricultural specialist with 7 years of paddy harvesting and mechanized thresher experience.',
    isVerified: true,
    isActive: true,
    createdAt: '2026-08-05T09:30:00Z'
  },
  {
    id: 202,
    fullName: 'Selvaraj P.',
    email: 'selvaraj.agri@farmconnect.in',
    mobileNumber: '+919789123456',
    password: 'Password@123',
    pin: '1234',
    role: 'WORKER',
    language: 'ta',
    villageOrTown: 'Kumbakonam',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    skills: ['Sugarcane Cutting', 'Tractor operation', 'Weeding', 'Spraying'],
    experienceYears: 9,
    dailyWageExpected: 800,
    reliabilityScore: 94,
    rating: 4.8,
    reviewCount: 31,
    availabilityStatus: 'AVAILABLE',
    bio: 'Lead cutter with high stamina. Expert in sugarcane harvesting, pesticide spraying, and tractor haulage.',
    isVerified: true,
    isActive: true,
    createdAt: '2026-08-08T11:00:00Z'
  },
  {
    id: 999,
    fullName: 'Admin - Delta Agritech Office',
    email: 'admin@farmconnect.in',
    mobileNumber: '+919800000000',
    password: 'AdminPassword@2026',
    pin: '9999',
    role: 'ADMIN',
    language: 'en',
    villageOrTown: 'Thanjavur Collectorate',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    isActive: true,
    createdAt: '2026-07-01T00:00:00Z'
  }
];

export const INITIAL_SERVER_DISPUTES: ServerDispute[] = [
  {
    id: 'disp-101',
    jobId: 101,
    jobTitle: 'Paddy Harvesting & Threshing',
    complainantName: 'Murugesan V.',
    complainantRole: 'WORKER',
    againstName: 'Murugan Farms',
    againstRole: 'FARMER',
    issue: 'Half-day overtime was worked on Sunday but recorded as standard shift.',
    category: 'ATTENDANCE',
    amountDisputed: 375,
    status: 'RESOLVED',
    createdAt: '2026-09-03T14:20:00Z',
    resolutionNote: 'Farmer approved the 4 hours overtime adjustment via UPI.'
  },
  {
    id: 'disp-102',
    jobId: 102,
    jobTitle: 'Sugarcane Cutting & Tractor Loading',
    complainantName: 'Kaveri Delta Agro',
    complainantRole: 'FARMER',
    againstName: 'Contractor Crew #4',
    againstRole: 'WORKER',
    issue: 'Late arrival of 2 workers due to local transport disruption.',
    category: 'BEHAVIOR',
    status: 'DISMISSED',
    createdAt: '2026-09-02T10:15:00Z',
    resolutionNote: 'Mutual agreement reached to extend work hours by 1 hour.'
  }
];
