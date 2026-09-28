import { 
  JobItem, JobApplication, WorkerCandidate, HiredWorkerRecord, 
  NotificationItem, UserSession, LanguageCode, UserRole,
  SavedJobItem, CalendarEvent, WorkforceSummary, EarningsSummary, EarningsRecord, JobRecommendation,
  UserAccount
} from '../types';
import { hashPassword, verifyPassword } from '../utils/security';

const STORAGE_KEYS = {
  USERS: 'farmconnect_users_v2',
  JOBS: 'farmconnect_jobs_v1',
  APPLICATIONS: 'farmconnect_applications_v1',
  CANDIDATES: 'farmconnect_candidates_v1',
  HIRED: 'farmconnect_hired_v1',
  NOTIFICATIONS: 'farmconnect_notifications_v1',
  SAVED_JOBS: 'farmconnect_saved_jobs_v1',
  USER_SESSION: 'farmconnect_session_v1',
  APP_LANGUAGE: 'farmconnect_language_v1',
  LAST_SYNC: 'farmconnect_last_sync_v1',
  INTRO_SEEN: 'farmconnect_has_seen_intro_v1'
};

// Initial Seed Data for Agricultural Jobs in India
export const INITIAL_JOBS: JobItem[] = [
  {
    id: 101,
    farmerId: 1,
    farmerName: 'Murugan Farms (Ramesh K.)',
    farmerPhone: '+91 98401 23456',
    farmerLocation: 'Thiruvaiyaru, Thanjavur (3.2 km away)',
    villageTown: 'Thiruvaiyaru',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    title: 'Paddy Harvesting & Threshing',
    cropType: 'Paddy',
    workType: 'Harvesting',
    description: 'Need 6 experienced workers for 3 days of paddy crop harvesting, bundling, and threshing. Lunch and morning tea provided on field.',
    workersRequired: 6,
    workersHired: 4,
    wageAmount: 750,
    wageType: 'PER_DAY',
    currency: 'INR',
    startDate: '2026-09-05',
    endDate: '2026-09-08',
    workingHours: '07:00 AM - 02:30 PM (7.5 hrs)',
    perks: ['Free Lunch & Tea', 'Transport from Village Junction', 'Same Day Cash/UPI'],
    toolsProvided: true,
    requiredSkills: ['Harvesting', 'Paddy work', 'Bundling'],
    distanceKm: 3.2,
    status: 'ACTIVE',
    createdAt: '2026-09-01T08:30:00Z'
  },
  {
    id: 102,
    farmerId: 2,
    farmerName: 'Kaveri Delta Agro (Senthil Nathan)',
    farmerPhone: '+91 97890 54321',
    farmerLocation: 'Kumbakonam (7.5 km away)',
    villageTown: 'Kumbakonam',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    title: 'Sugarcane Cutting & Tractor Loading',
    cropType: 'Sugarcane',
    workType: 'Cutting',
    description: 'Sugarcane harvest team needed. Heavy cutting and loading onto mill trucks. Experienced cutter groups preferred.',
    workersRequired: 10,
    workersHired: 6,
    wageAmount: 850,
    wageType: 'PER_DAY',
    currency: 'INR',
    startDate: '2026-09-06',
    endDate: '2026-09-12',
    workingHours: '06:30 AM - 02:00 PM (7.5 hrs)',
    perks: ['Breakfast & Lunch', 'Sugarcane Juice Refreshments', 'Overtime Bonus ₹120/hr'],
    toolsProvided: true,
    requiredSkills: ['Cutting', 'Heavy Loading', 'Tractor operation'],
    distanceKm: 7.5,
    status: 'ACTIVE',
    createdAt: '2026-09-01T09:15:00Z'
  },
  {
    id: 103,
    farmerId: 3,
    farmerName: 'Green Valley Organic (Anand Raj)',
    farmerPhone: '+91 94432 11223',
    farmerLocation: 'Papanasam (11.0 km away)',
    villageTown: 'Papanasam',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    title: 'Cotton Picking & Sorting',
    cropType: 'Cotton',
    workType: 'Harvesting',
    description: 'Clean picking of 2nd flush cotton bolls without trash. Gentle handling required for organic grade certification.',
    workersRequired: 8,
    workersHired: 3,
    wageAmount: 700,
    wageType: 'PER_DAY',
    currency: 'INR',
    startDate: '2026-09-07',
    endDate: '2026-09-10',
    workingHours: '07:30 AM - 03:00 PM',
    perks: ['Cotton Bags Provided', 'Drinking Water & Shade', 'Weigh-scale transparent bonus'],
    toolsProvided: true,
    requiredSkills: ['Harvesting', 'Cotton Picking', 'Grading'],
    distanceKm: 11.0,
    status: 'ACTIVE',
    createdAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 104,
    farmerId: 1,
    farmerName: 'Murugan Farms (Ramesh K.)',
    farmerPhone: '+91 98401 23456',
    farmerLocation: 'Thiruvaiyaru, Thanjavur (3.2 km away)',
    villageTown: 'Thiruvaiyaru',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    title: 'Tractor Tilling & Sowing Prep',
    cropType: 'Paddy',
    workType: 'Tractor operation',
    description: 'Puddling and rotary tilling for 4 acres kuruvai nursery preparation. Tractor operator with diesel allowance.',
    workersRequired: 2,
    workersHired: 1,
    wageAmount: 1100,
    wageType: 'PER_DAY',
    currency: 'INR',
    startDate: '2026-09-09',
    endDate: '2026-09-11',
    workingHours: '06:00 AM - 01:00 PM',
    perks: ['Diesel Reimbursed', 'Lunch Included', 'Equipment Insurance'],
    toolsProvided: false,
    requiredSkills: ['Tractor operation', 'Puddling', 'Land Prep'],
    distanceKm: 3.2,
    status: 'ACTIVE',
    createdAt: '2026-09-01T11:00:00Z'
  }
];

// Initial Candidate Workers for Farmer search
export const INITIAL_CANDIDATES: WorkerCandidate[] = [
  {
    id: 201,
    fullName: 'Murugesan V.',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    gender: 'MALE',
    aadhaarVerified: true,
    upiId: 'murugesan.agri@oksbi',
    bankAccountLast4: '4192',
    bankName: 'Canara Bank (Thiruvaiyaru)',
    mobileNumber: '+91 98405 67890',
    villageTown: 'Thiruvaiyaru',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    distanceKm: 2.1,
    skills: ['Harvesting', 'Paddy work', 'Bundling', 'Tractor operation'],
    toolsOwned: ['Sickle (Heavy)', 'Rubber Field Boots', 'Thresher Safety Gloves'],
    certifications: ['TNAU Certified Harvester 2023'],
    punctualityScore: 98,
    experienceYears: 7,
    dailyRate: 750,
    reliabilityScore: 96,
    rating: 4.9,
    reviewCount: 22,
    availabilityStatus: 'AVAILABLE',
    mainCropsHandled: ['Paddy', 'Sugarcane', 'Banana'],
    bio: 'Punctual, hardworking agricultural specialist with 7 years of paddy harvesting and mechanized thresher experience.',
    reviews: [
      {
        id: 'r-1',
        reviewerName: 'Senthil Nathan',
        reviewerRole: 'FARMER',
        rating: 5,
        date: '2026-08-28',
        comment: 'Excellent worker, arrived right at 6:30 AM with sickle. Finished harvesting 1.5 acres before noon!',
        cropType: 'Paddy'
      },
      {
        id: 'r-2',
        reviewerName: 'Kaveri Agro',
        reviewerRole: 'FARMER',
        rating: 4.8,
        date: '2026-08-15',
        comment: 'Very reliable and disciplined during sugarcane cutting. Highly recommended.',
        cropType: 'Sugarcane'
      }
    ]
  },
  {
    id: 202,
    fullName: 'Selvaraj P.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    gender: 'MALE',
    aadhaarVerified: true,
    upiId: 'selvaraj.harvest@apl',
    bankAccountLast4: '8831',
    bankName: 'Indian Overseas Bank (Kumbakonam)',
    mobileNumber: '+91 97891 23456',
    villageTown: 'Kumbakonam',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    distanceKm: 4.8,
    skills: ['Sugarcane Cutting', 'Tractor operation', 'Weeding', 'Spraying'],
    toolsOwned: ['Cane Machete (Heavy)', 'Pesticide Mask & Knapsack'],
    certifications: ['State Safety Sprayer Licensed'],
    punctualityScore: 95,
    experienceYears: 9,
    dailyRate: 800,
    reliabilityScore: 94,
    rating: 4.8,
    reviewCount: 31,
    availabilityStatus: 'AVAILABLE',
    mainCropsHandled: ['Sugarcane', 'Cotton', 'Paddy'],
    bio: 'Lead cutter with high stamina. Expert in sugarcane harvesting, pesticide spraying, and tractor haulage.',
    reviews: [
      {
        id: 'r-3',
        reviewerName: 'Ramesh K.',
        reviewerRole: 'FARMER',
        rating: 5,
        date: '2026-08-20',
        comment: 'Handled pesticide sprayer with complete safety gear. Very knowledgeable.',
        cropType: 'Paddy'
      }
    ]
  },
  {
    id: 203,
    fullName: 'Lakshmi Devi',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    gender: 'FEMALE',
    aadhaarVerified: true,
    upiId: 'lakshmi.delta@paytm',
    bankAccountLast4: '2049',
    bankName: 'State Bank of India (Papanasam)',
    mobileNumber: '+91 94456 78901',
    villageTown: 'Papanasam',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    distanceKm: 6.2,
    skills: ['Cotton Picking', 'Weeding', 'Sowing', 'Paddy Transplanting'],
    toolsOwned: ['Cotton Bag Hauler', 'Nursery Line Rope', 'Hand Weeder'],
    certifications: ['Cauvery Delta Line Transplanting Master'],
    punctualityScore: 99,
    experienceYears: 5,
    dailyRate: 700,
    reliabilityScore: 98,
    rating: 5.0,
    reviewCount: 19,
    availabilityStatus: 'AVAILABLE',
    mainCropsHandled: ['Cotton', 'Paddy', 'Vegetables'],
    bio: 'Fastest cotton picker in Papanasam block. Expert in nursery bed preparation and line transplanting.',
    reviews: [
      {
        id: 'r-4',
        reviewerName: 'Anand Raj',
        reviewerRole: 'FARMER',
        rating: 5,
        date: '2026-08-24',
        comment: 'Picked 45 kg clean cotton in a single shift! Outstanding work quality.',
        cropType: 'Cotton'
      }
    ]
  },
  {
    id: 204,
    fullName: 'Karthik Raja',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    gender: 'MALE',
    aadhaarVerified: true,
    upiId: 'karthik.tractor@axl',
    bankAccountLast4: '7721',
    bankName: 'HDFC Bank Agri (Budalur)',
    mobileNumber: '+91 93450 12345',
    villageTown: 'Budalur',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    distanceKm: 8.5,
    skills: ['Tractor operation', 'Harvesting', 'Drip Irrigation Setup'],
    toolsOwned: ['Commercial Tractor Driving License (Heavy)', 'Rotavator Safety Gear'],
    certifications: ['Licensed 45HP Tractor Operator'],
    punctualityScore: 94,
    experienceYears: 4,
    dailyRate: 850,
    reliabilityScore: 91,
    rating: 4.7,
    reviewCount: 14,
    availabilityStatus: 'BUSY',
    mainCropsHandled: ['Paddy', 'Maize'],
    bio: 'Mechanized farmer helper, licensed 45HP tractor driver with laser leveler experience.',
    reviews: [
      {
        id: 'r-5',
        reviewerName: 'Velu Farms',
        reviewerRole: 'FARMER',
        rating: 4.6,
        date: '2026-08-10',
        comment: 'Completed rotavator leveling in record time.',
        cropType: 'Paddy'
      }
    ]
  },
  {
    id: 205,
    fullName: 'Anandhi K.',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80',
    gender: 'FEMALE',
    aadhaarVerified: true,
    upiId: 'anandhi.organic@okicici',
    bankAccountLast4: '3910',
    bankName: 'Canara Bank (Orathanadu)',
    mobileNumber: '+91 98412 88712',
    villageTown: 'Orathanadu',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    distanceKm: 5.4,
    skills: ['Drip Irrigation Setup', 'Weeding', 'Paddy work', 'Organic Fertilizing'],
    toolsOwned: ['Drip Punch Tool', 'Organic Compost Sprayer'],
    certifications: ['TNAU Micro-Irrigation Certified'],
    punctualityScore: 97,
    experienceYears: 6,
    dailyRate: 720,
    reliabilityScore: 97,
    rating: 4.9,
    reviewCount: 16,
    availabilityStatus: 'AVAILABLE',
    mainCropsHandled: ['Vegetables', 'Banana', 'Paddy'],
    bio: 'Specialist in precision drip tube laying and vegetable nursery management. Punctual and careful with crops.',
    reviews: [
      {
        id: 'r-6',
        reviewerName: 'Subramanian G.',
        reviewerRole: 'FARMER',
        rating: 5,
        date: '2026-08-18',
        comment: 'Set up 3 acres of banana drip lines in 2 days. Flawless work.',
        cropType: 'Banana'
      }
    ]
  }
];

// Initial Applications Seed
export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-101-201',
    jobId: 101,
    jobTitle: 'Paddy Harvesting & Threshing',
    cropType: 'Paddy',
    farmerId: 1,
    farmerName: 'Murugan Farms (Ramesh K.)',
    farmerPhone: '+91 98401 23456',
    farmerLocation: 'Thiruvaiyaru, Thanjavur (3.2 km away)',
    workerId: 201,
    workerName: 'Murugesan V.',
    workerPhone: '+91 98405 67890',
    workerSkills: ['Harvesting', 'Paddy work', 'Bundling'],
    workerExperienceYears: 7,
    workerReliabilityScore: 96,
    workerRating: 4.9,
    appliedWage: 750,
    message: 'I have sharp sickle and 7 years of harvesting experience. Can start tomorrow morning at 6:30 AM.',
    status: 'HIRED',
    appliedAt: '2026-09-01T09:00:00Z',
    startDate: '2026-09-05',
    endDate: '2026-09-08',
    matchScore: 98
  },
  {
    id: 'app-102-201',
    jobId: 102,
    jobTitle: 'Sugarcane Cutting & Tractor Loading',
    cropType: 'Sugarcane',
    farmerId: 2,
    farmerName: 'Kaveri Delta Agro (Senthil Nathan)',
    farmerPhone: '+91 97890 54321',
    farmerLocation: 'Kumbakonam (7.5 km away)',
    workerId: 201,
    workerName: 'Murugesan V.',
    workerPhone: '+91 98405 67890',
    workerSkills: ['Harvesting', 'Heavy Loading'],
    workerExperienceYears: 7,
    workerReliabilityScore: 96,
    workerRating: 4.9,
    appliedWage: 850,
    message: 'Ready for full week harvest shift. Have safety boots.',
    status: 'APPLIED',
    appliedAt: '2026-09-01T10:30:00Z',
    startDate: '2026-09-06',
    endDate: '2026-09-12',
    matchScore: 92
  }
];

// Initial Hired Workers Records (for Farmer attendance and payment)
export const INITIAL_HIRED: HiredWorkerRecord[] = [
  {
    id: 'hired-1',
    jobId: 101,
    jobTitle: 'Paddy Harvesting & Threshing',
    farmerId: 1,
    farmerName: 'Murugan Farms (Ramesh K.)',
    workerId: 201,
    workerName: 'Murugesan V.',
    workerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    workerPhone: '+91 98405 67890',
    workerLocation: 'Thiruvaiyaru (2.1 km away)',
    upiId: 'murugesan.agri@oksbi',
    bankAccountLast4: '4192',
    bankName: 'Canara Bank (Thiruvaiyaru)',
    dailyWage: 750,
    startDate: '2026-09-01',
    endDate: '2026-09-04',
    status: 'ACTIVE',
    attendance: [
      { date: '2026-09-01', status: 'PRESENT', hoursWorked: 7.5, recordedBy: 'Ramesh K.' },
      { date: '2026-09-02', status: 'PRESENT', hoursWorked: 8.0, recordedBy: 'Ramesh K.' }
    ],
    totalDaysPresent: 2,
    totalEarnings: 1500,
    paidAmount: 750,
    paymentMode: 'UPI',
    farmerRating: 5.0,
    farmerReview: 'Very fast and clean bundle stacking.'
  },
  {
    id: 'hired-2',
    jobId: 101,
    jobTitle: 'Paddy Harvesting & Threshing',
    farmerId: 1,
    farmerName: 'Murugan Farms (Ramesh K.)',
    workerId: 202,
    workerName: 'Selvaraj P.',
    workerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    workerPhone: '+91 97891 23456',
    workerLocation: 'Kumbakonam (4.8 km away)',
    upiId: 'selvaraj.harvest@apl',
    bankAccountLast4: '8831',
    bankName: 'Indian Overseas Bank (Kumbakonam)',
    dailyWage: 800,
    startDate: '2026-09-01',
    endDate: '2026-09-04',
    status: 'ACTIVE',
    attendance: [
      { date: '2026-09-01', status: 'PRESENT', hoursWorked: 7.5, recordedBy: 'Ramesh K.' },
      { date: '2026-09-02', status: 'PRESENT', hoursWorked: 7.5, recordedBy: 'Ramesh K.' }
    ],
    totalDaysPresent: 2,
    totalEarnings: 1600,
    paidAmount: 800
  }
];

// Initial Notifications
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Job Application Accepted! 🎉',
    message: 'Farmer Ramesh K. has hired you for "Paddy Harvesting & Threshing" starting Sept 5th.',
    type: 'WORKER_HIRED',
    timestamp: '10 mins ago',
    read: false,
    relatedJobId: 101,
    recipientUserId: 201
  },
  {
    id: 'notif-2',
    title: 'Daily Wage Payment Received 💸',
    message: '₹750 credited via UPI for Sept 1st Paddy harvest shift.',
    type: 'PAYMENT',
    timestamp: '2 hours ago',
    read: false,
    recipientUserId: 201
  },
  {
    id: 'notif-3',
    title: 'High Demand Alert in Thanjavur 🌾',
    message: '14 new Paddy harvesting jobs posted nearby with daily rates up to ₹850/day.',
    type: 'ALERT',
    timestamp: '5 hours ago',
    read: true
  }
];

// Initial Seed Users for Demonstration & Testing
export const INITIAL_USERS: UserAccount[] = [
  {
    id: 1,
    fullName: 'Ramesh K. (Murugan Farms)',
    email: 'ramesh.farmer@farmconnect.in',
    mobileNumber: '+91 98401 23456',
    passwordHash: 'sha256_b37a1f592658a5c37890fde46241b1239a',
    role: 'FARMER',
    language: 'en',
    villageOrTown: 'Thiruvaiyaru',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    farmSizeAcres: 5.5,
    mainCrops: ['Paddy', 'Sugarcane'],
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    bio: 'Farmer cultivating 5.5 acres of kuruvai paddy and sugarcane in Thiruvaiyaru.',
    termsAccepted: true,
    createdAt: '2026-08-15T08:00:00Z'
  },
  {
    id: 201,
    fullName: 'Murugesan V.',
    email: 'murugesan.worker@farmconnect.in',
    mobileNumber: '+91 98405 67890',
    passwordHash: 'sha256_b37a1f592658a5c37890fde46241b1239a',
    role: 'WORKER',
    language: 'en',
    villageOrTown: 'Thiruvaiyaru',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    skills: ['Harvesting', 'Paddy work', 'Bundling', 'Tractor operation'],
    experienceYears: 7,
    dailyWageExpected: 750,
    reliabilityScore: 96,
    rating: 4.9,
    reviewCount: 28,
    availabilityStatus: 'AVAILABLE',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Experienced harvester and bundler with 7+ years across Cauvery delta.',
    termsAccepted: true,
    createdAt: '2026-08-18T10:30:00Z'
  },
  {
    id: 999,
    fullName: 'Admin - Delta Agritech Office',
    email: 'admin@farmconnect.in',
    mobileNumber: '+91 99999 00000',
    passwordHash: 'sha256_admin_secret_hash_value',
    role: 'ADMIN',
    language: 'en',
    villageOrTown: 'Thanjavur Collectorate',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    termsAccepted: true,
    createdAt: '2026-08-01T00:00:00Z'
  }
];

// Persistent State Helper Class
export class FarmConnectStore {
  static load<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  static save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Failed to save to ${key}:`, e);
    }
  }

  static deleteJob(jobId: number): void {
    const jobs = this.getJobs();
    const updated = jobs.filter(j => j.id !== jobId);
    this.save(STORAGE_KEYS.JOBS, updated);
  }

  static getJobs(): JobItem[] {
    return this.load<JobItem[]>(STORAGE_KEYS.JOBS, INITIAL_JOBS);
  }

  static saveJob(job: Partial<JobItem> & { title: string; cropType: string; wageAmount: number }): JobItem {
    const jobs = this.getJobs();
    const newJob: JobItem = {
      id: Date.now(),
      farmerId: job.farmerId || 1,
      farmerName: job.farmerName || 'Murugan Farms (Ramesh K.)',
      farmerPhone: job.farmerPhone || '+91 98401 23456',
      farmerLocation: job.farmerLocation || 'Thiruvaiyaru, Thanjavur (3.2 km away)',
      villageTown: job.villageTown || 'Thiruvaiyaru',
      district: job.district || 'Thanjavur',
      state: job.state || 'Tamil Nadu',
      title: job.title,
      cropType: job.cropType,
      workType: job.workType || 'Harvesting',
      description: job.description || 'Agricultural field work needed with fair wages.',
      workersRequired: Number(job.workersRequired) || 5,
      workersHired: 0,
      wageAmount: Number(job.wageAmount) || 750,
      wageType: job.wageType || 'PER_DAY',
      currency: 'INR',
      startDate: job.startDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      endDate: job.endDate || new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
      workingHours: job.workingHours || '07:00 AM - 02:00 PM',
      perks: job.perks || ['Lunch Provided', 'Same Day Cash/UPI'],
      toolsProvided: job.toolsProvided !== undefined ? job.toolsProvided : true,
      requiredSkills: job.requiredSkills || [job.cropType, 'Field labor'],
      distanceKm: 2.5,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    const updated = [newJob, ...jobs];
    this.save(STORAGE_KEYS.JOBS, updated);
    
    this.addNotification({
      title: 'New Job Posted Successfully',
      message: `Your listing for "${newJob.title}" is live. Workers in ${newJob.district} can now apply.`,
      type: 'STATUS',
      relatedJobId: newJob.id
    });

    return newJob;
  }

  static getJobById(id: number): JobItem | undefined {
    return this.getJobs().find(j => j.id === id);
  }

  static getApplications(): JobApplication[] {
    return this.load<JobApplication[]>(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  }

  static applyForJob(
    jobOrId: number | JobItem,
    workerOrId: any,
    arg3?: any,
    arg4?: any,
    arg5?: any,
    arg6?: any,
    arg7?: any,
    arg8?: any
  ): JobApplication {
    let job: JobItem | undefined;
    if (typeof jobOrId === 'number') {
      job = this.getJobById(jobOrId);
    } else {
      job = jobOrId;
    }

    if (!job) {
      const allJobs = this.getJobs();
      job = allJobs[0];
    }

    let workerId = typeof workerOrId === 'number' ? workerOrId : (workerOrId?.id || 10);
    let workerName = typeof workerOrId === 'object' ? workerOrId.fullName : (typeof arg3 === 'string' ? arg3 : 'Murugesan V.');
    let workerPhone = typeof workerOrId === 'object' ? workerOrId.mobileNumber : (typeof arg4 === 'string' ? arg4 : '+91 98405 67890');
    let message = typeof arg5 === 'string' ? arg5 : (typeof arg3 === 'string' && typeof workerOrId === 'object' ? arg3 : 'Available for harvesting.');
    let proposedWage = typeof arg6 === 'number' ? arg6 : (typeof arg4 === 'number' ? arg4 : job.wageAmount);
    let workerExp = typeof arg7 === 'number' ? arg7 : (typeof workerOrId === 'object' ? workerOrId.experienceYears || 6 : 6);
    let workerSkills = Array.isArray(arg8) ? arg8 : (typeof workerOrId === 'object' && Array.isArray(workerOrId.skills) ? workerOrId.skills : ['Harvesting', 'Paddy work']);

    const apps = this.getApplications();
    const existing = apps.find(a => a.jobId === job!.id && a.workerId === workerId);
    
    if (existing) {
      return existing;
    }

    const newApp: JobApplication = {
      id: `app-${job.id}-${workerId}-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      cropType: job.cropType,
      farmerId: job.farmerId,
      farmerName: job.farmerName,
      farmerPhone: job.farmerPhone,
      farmerLocation: job.farmerLocation,
      workerId,
      workerName,
      workerPhone,
      workerSkills,
      workerExperienceYears: workerExp,
      workerReliabilityScore: 96,
      workerRating: 4.9,
      appliedWage: proposedWage,
      proposedWage,
      message,
      status: 'APPLIED',
      appliedAt: new Date().toISOString(),
      startDate: job.startDate,
      endDate: job.endDate,
      matchScore: Math.min(99, Math.floor(88 + Math.random() * 11))
    };

    const updated = [newApp, ...apps];
    this.save(STORAGE_KEYS.APPLICATIONS, updated);

    this.addNotification({
      title: 'Application Submitted!',
      message: `You applied for "${job.title}" at ₹${newApp.appliedWage}/day. The farmer has been notified.`,
      type: 'JOB_APPLIED',
      relatedJobId: job.id
    });

    return newApp;
  }

  static hasWorkerApplied(workerId: number, jobId: number): boolean {
    const apps = this.getApplications();
    return apps.some(a => a.jobId === jobId && (a.workerId === workerId || Number(a.workerId) === Number(workerId)));
  }

  static createJob(jobData: Partial<JobItem>): JobItem {
    const jobs = this.getJobs();
    const newId = Math.max(...jobs.map(j => j.id), 100) + 1;
    
    const newJob: JobItem = {
      id: newId,
      farmerId: jobData.farmerId || 1,
      farmerName: jobData.farmerName || 'Murugan Farms (Ramesh K.)',
      farmerPhone: jobData.farmerPhone || '+91 98401 23456',
      farmerLocation: jobData.farmerLocation || `${jobData.villageTown || 'Thiruvaiyaru'}, ${jobData.district || 'Thanjavur'}`,
      villageTown: jobData.villageTown || 'Thiruvaiyaru',
      district: jobData.district || 'Thanjavur',
      state: jobData.state || 'Tamil Nadu',
      title: jobData.title || `${jobData.cropType || 'Paddy'} Harvesting Work`,
      cropType: jobData.cropType || 'Paddy',
      workType: jobData.workType || 'Harvesting',
      description: jobData.description || 'Experienced agricultural workers needed for seasonal field operations.',
      workersRequired: Number(jobData.workersRequired) || 4,
      workersHired: 0,
      wageAmount: Number(jobData.wageAmount) || 750,
      wageType: jobData.wageType || 'PER_DAY',
      currency: 'INR',
      startDate: jobData.startDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      endDate: jobData.endDate || new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
      workingHours: jobData.workingHours || '07:00 AM - 02:30 PM (7.5 hrs)',
      perks: jobData.perks || ['Free Lunch & Tea', 'Daily Cash/UPI Payout'],
      toolsProvided: jobData.toolsProvided !== undefined ? jobData.toolsProvided : true,
      requiredSkills: jobData.requiredSkills || ['Harvesting', 'Field work'],
      distanceKm: 2.5,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    const updatedJobs = [newJob, ...jobs];
    this.save(STORAGE_KEYS.JOBS, updatedJobs);

    this.addNotification({
      title: 'New Job Published! 🌾',
      message: `"${newJob.title}" for ${newJob.cropType} has been broadcast to verified workers in ${newJob.district}.`,
      type: 'STATUS',
      relatedJobId: newJob.id
    });

    return newJob;
  }

  static inviteWorker(jobId: number, workerId: number, workerName: string, workerMobile: string): void {
    this.addNotification({
      title: 'Worker Invited 📩',
      message: `Direct job invitation sent to ${workerName} (${workerMobile}) for Job #${jobId}.`,
      type: 'ALERT',
      relatedJobId: jobId,
      relatedWorkerId: workerId
    });
  }

  static hireApplicant(appId: string) {
    return this.hireWorker(appId);
  }

  static rateWorker(hiredId: string, rating: number, comment: string) {
    return this.addReview(hiredId, rating, comment);
  }

  static getSession(): UserSession | null {
    return this.getUserSession();
  }

  static saveSession(session: UserSession | null): void {
    this.setUserSession(session);
  }

  static clearSession(): void {
    this.setUserSession(null);
  }

  static updateSession(updatedData: Partial<UserSession>): UserSession | null {
    const curr = this.getUserSession();
    if (!curr) return null;
    const merged = { ...curr, ...updatedData };
    this.setUserSession(merged);
    return merged;
  }

  static withdrawApplication(appId: string): void {
    const apps = this.getApplications();
    const updated = apps.map(a => a.id === appId ? { ...a, status: 'WITHDRAWN' as const } : a);
    this.save(STORAGE_KEYS.APPLICATIONS, updated);
  }

  static hireWorker(appId: string): { application: JobApplication; hiredRecord: HiredWorkerRecord } {
    const apps = this.getApplications();
    const targetApp = apps.find(a => a.id === appId);
    if (!targetApp) throw new Error('Application not found');

    const updatedApps = apps.map(a => a.id === appId ? { ...a, status: 'HIRED' as const } : a);
    this.save(STORAGE_KEYS.APPLICATIONS, updatedApps);

    // Update job workers hired count
    const jobs = this.getJobs();
    const updatedJobs = jobs.map(j => {
      if (j.id === targetApp.jobId) {
        const hiredCount = Math.min(j.workersRequired, j.workersHired + 1);
        return {
          ...j,
          workersHired: hiredCount,
          status: hiredCount >= j.workersRequired ? ('FILLED' as const) : j.status
        };
      }
      return j;
    });
    this.save(STORAGE_KEYS.JOBS, updatedJobs);

    // Add Hired Record
    const hired = this.getHiredWorkers();
    const newHiredRecord: HiredWorkerRecord = {
      id: `hired-${Date.now()}`,
      jobId: targetApp.jobId,
      jobTitle: targetApp.jobTitle,
      farmerId: targetApp.farmerId,
      farmerName: targetApp.farmerName,
      workerId: targetApp.workerId,
      workerName: targetApp.workerName,
      workerPhone: targetApp.workerPhone,
      workerLocation: targetApp.farmerLocation,
      dailyWage: targetApp.appliedWage,
      startDate: targetApp.startDate,
      endDate: targetApp.endDate,
      status: 'ACTIVE',
      attendance: [
        {
          date: new Date().toISOString().split('T')[0],
          status: 'PRESENT',
          hoursWorked: 7.5,
          recordedBy: targetApp.farmerName
        }
      ],
      totalDaysPresent: 1,
      totalEarnings: targetApp.appliedWage,
      paidAmount: 0
    };

    const updatedHired = [newHiredRecord, ...hired];
    this.save(STORAGE_KEYS.HIRED, updatedHired);

    this.addNotification({
      title: 'Worker Hired Successfully 🤝',
      message: `You hired ${targetApp.workerName} for "${targetApp.jobTitle}". Phone: ${targetApp.workerPhone}`,
      type: 'WORKER_HIRED',
      relatedJobId: targetApp.jobId,
      relatedWorkerId: targetApp.workerId
    });

    return { application: targetApp, hiredRecord: newHiredRecord };
  }

  static getCandidates(): WorkerCandidate[] {
    return this.load<WorkerCandidate[]>(STORAGE_KEYS.CANDIDATES, INITIAL_CANDIDATES);
  }

  static getHiredWorkers(): HiredWorkerRecord[] {
    return this.load<HiredWorkerRecord[]>(STORAGE_KEYS.HIRED, INITIAL_HIRED);
  }

  static markAttendance(hiredId: string, status: 'PRESENT' | 'ABSENT' | 'HALF_DAY'): HiredWorkerRecord {
    const list = this.getHiredWorkers();
    const today = new Date().toISOString().split('T')[0];
    
    const updated = list.map(item => {
      if (item.id === hiredId) {
        const filteredAtt = item.attendance.filter(a => a.date !== today);
        const hours = status === 'PRESENT' ? 7.5 : status === 'HALF_DAY' ? 4.0 : 0;
        const newAtt = [...filteredAtt, { date: today, status, hoursWorked: hours, recordedBy: item.farmerName }];
        const presentDays = newAtt.filter(a => a.status === 'PRESENT').length + (newAtt.filter(a => a.status === 'HALF_DAY').length * 0.5);
        const totalEarnings = Math.round(presentDays * item.dailyWage);
        return {
          ...item,
          attendance: newAtt,
          totalDaysPresent: presentDays,
          totalEarnings
        };
      }
      return item;
    });

    this.save(STORAGE_KEYS.HIRED, updated);
    return updated.find(i => i.id === hiredId)!;
  }

  static recordPayment(
    hiredId: string, 
    amount: number, 
    paymentMode: 'UPI' | 'CASH' | 'BANK_TRANSFER' = 'UPI',
    transactionRef?: string
  ): HiredWorkerRecord {
    const list = this.getHiredWorkers();
    const utr = transactionRef || `${paymentMode}/${new Date().getFullYear()}/AGRI/${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    let paidItem: HiredWorkerRecord | undefined;

    const updated = list.map(item => {
      if (item.id === hiredId) {
        const newPaid = item.paidAmount + amount;
        paidItem = {
          ...item,
          paidAmount: newPaid,
          paymentMode,
          paymentDate: new Date().toISOString(),
          transactionRef: utr,
          status: newPaid >= item.totalEarnings ? ('PAID' as const) : item.status
        };
        return paidItem;
      }
      return item;
    });

    this.save(STORAGE_KEYS.HIRED, updated);
    
    // Also update session worker earnings if applicable
    const session = this.getUserSession();
    if (session && session.role === 'WORKER' && paidItem && session.userId === paidItem.workerId) {
      session.totalEarnings = (session.totalEarnings || 0) + amount;
      this.setUserSession(session);
    }

    this.addNotification({
      title: 'Wage Payment Disbursed 💳',
      message: `₹${amount.toLocaleString()} paid to ${paidItem?.workerName || 'Worker'} via ${paymentMode}. UTR: ${utr}.`,
      type: 'PAYMENT',
      relatedWorkerId: paidItem?.workerId
    });

    return paidItem || updated.find(i => i.id === hiredId)!;
  }

  static addReview(hiredId: string, rating: number, comment: string): HiredWorkerRecord {
    const list = this.getHiredWorkers();
    const updated = list.map(item => {
      if (item.id === hiredId) {
        return {
          ...item,
          farmerRating: rating,
          farmerReview: comment,
          status: 'COMPLETED' as const
        };
      }
      return item;
    });

    this.save(STORAGE_KEYS.HIRED, updated);
    return updated.find(i => i.id === hiredId)!;
  }

  static getNotifications(recipientUserId?: number): NotificationItem[] {
    const list = this.load<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    if (!recipientUserId) {
      return list;
    }
    // Filter specifically for this recipient user, plus broadcast system alerts
    return list.filter(n => n.recipientUserId === recipientUserId || (!n.recipientUserId && (n.type === 'ALERT' || n.type === 'STATUS')));
  }

  static addNotification(notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): NotificationItem {
    const list = this.load<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
      ...notif
    };
    const updated = [newNotif, ...list.slice(0, 49)];
    this.save(STORAGE_KEYS.NOTIFICATIONS, updated);
    return newNotif;
  }

  static markNotificationRead(id: string): void {
    const list = this.getNotifications();
    const updated = list.map(n => n.id === id ? { ...n, read: true } : n);
    this.save(STORAGE_KEYS.NOTIFICATIONS, updated);
  }

  static markAllNotificationsRead(): void {
    const list = this.getNotifications();
    const updated = list.map(n => ({ ...n, read: true }));
    this.save(STORAGE_KEYS.NOTIFICATIONS, updated);
  }

  static deleteNotification(id: string): void {
    const list = this.getNotifications();
    const updated = list.filter(n => n.id !== id);
    this.save(STORAGE_KEYS.NOTIFICATIONS, updated);
  }

  static clearAllNotifications(): void {
    this.save(STORAGE_KEYS.NOTIFICATIONS, []);
  }

  // ==========================================
  // SAVED JOBS PERSISTENCE & DEDUPING
  // ==========================================
  static getSavedJobs(workerId: number = 201): SavedJobItem[] {
    const allSaved = this.load<SavedJobItem[]>(STORAGE_KEYS.SAVED_JOBS, []);
    const jobs = this.getJobs();
    
    // Enrich with latest job information
    return allSaved
      .filter(s => s.workerId === workerId)
      .map(s => {
        const currentJob = jobs.find(j => j.id === s.jobId);
        return {
          ...s,
          job: currentJob || s.job
        };
      });
  }

  static isJobSaved(workerId: number = 201, jobId: number): boolean {
    const allSaved = this.load<SavedJobItem[]>(STORAGE_KEYS.SAVED_JOBS, []);
    return allSaved.some(s => s.workerId === workerId && s.jobId === jobId);
  }

  static saveJobForWorker(workerId: number = 201, jobId: number): { success: boolean; message: string; savedItem?: SavedJobItem } {
    const allSaved = this.load<SavedJobItem[]>(STORAGE_KEYS.SAVED_JOBS, []);
    const existing = allSaved.find(s => s.workerId === workerId && s.jobId === jobId);
    
    if (existing) {
      return { success: false, message: 'Job is already saved' };
    }

    const job = this.getJobById(jobId);
    if (!job) {
      return { success: false, message: 'Job not found' };
    }

    const newSaved: SavedJobItem = {
      id: `saved-${workerId}-${jobId}`,
      workerId,
      jobId,
      savedAt: new Date().toISOString(),
      job
    };

    const updated = [newSaved, ...allSaved];
    this.save(STORAGE_KEYS.SAVED_JOBS, updated);

    this.addNotification({
      title: 'Job Saved to Bookmarks ♡',
      message: `"${job.title}" has been saved to your Bookmarks list.`,
      type: 'STATUS',
      relatedJobId: job.id
    });

    return { success: true, message: 'Job saved successfully', savedItem: newSaved };
  }

  static unsaveJob(workerId: number = 201, jobId: number): boolean {
    const allSaved = this.load<SavedJobItem[]>(STORAGE_KEYS.SAVED_JOBS, []);
    const updated = allSaved.filter(s => !(s.workerId === workerId && s.jobId === jobId));
    this.save(STORAGE_KEYS.SAVED_JOBS, updated);
    return true;
  }

  static getSavedJobIds(workerId: number = 201): number[] {
    const saved = this.getSavedJobs(workerId);
    return saved.map(s => s.jobId);
  }

  static toggleSaveJob(jobId: number, workerId: number = 201): number[] {
    const isSaved = this.isJobSaved(workerId, jobId);
    if (isSaved) {
      this.unsaveJob(workerId, jobId);
    } else {
      this.saveJobForWorker(workerId, jobId);
    }
    return this.getSavedJobIds(workerId);
  }

  // ==========================================
  // APPLICATION TRACKING & STATE MACHINE
  // ==========================================
  static updateApplicationStatus(
    appId: string, 
    newStatus: JobApplication['status'], 
    notes?: string
  ): JobApplication {
    const apps = this.getApplications();
    const app = apps.find(a => a.id === appId);
    if (!app) throw new Error('Application not found');

    // State transition validation rule
    const validTransitions: Record<JobApplication['status'], JobApplication['status'][]> = {
      APPLIED: ['SHORTLISTED', 'HIRED', 'REJECTED', 'WITHDRAWN'],
      SHORTLISTED: ['HIRED', 'REJECTED', 'WITHDRAWN'],
      HIRED: ['COMPLETED'],
      REJECTED: [],
      WITHDRAWN: [],
      COMPLETED: []
    };

    const allowed = validTransitions[app.status] || [];
    if (!allowed.includes(newStatus)) {
      throw new Error(`Invalid status transition from ${app.status} to ${newStatus}`);
    }

    const updated = apps.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          status: newStatus,
          message: notes ? `${a.message || ''} (Note: ${notes})` : a.message
        };
      }
      return a;
    });

    this.save(STORAGE_KEYS.APPLICATIONS, updated);

    // If newly HIRED, generate hiring record and attendance
    if (newStatus === 'HIRED') {
      this.hireWorker(appId);
    } else if (newStatus === 'REJECTED') {
      this.addNotification({
        title: 'Application Update',
        message: `Your application for "${app.jobTitle}" was not selected this time. Other local farm opportunities are open.`,
        type: 'APPLICATION_REJECTED',
        relatedJobId: app.jobId
      });
    } else if (newStatus === 'WITHDRAWN') {
      this.addNotification({
        title: 'Application Withdrawn',
        message: `You successfully withdrew your application for "${app.jobTitle}".`,
        type: 'STATUS',
        relatedJobId: app.jobId
      });
    }

    return updated.find(a => a.id === appId)!;
  }

  // ==========================================
  // WORKER EARNINGS & NUMERIC MONETARY CALCULATOR
  // ==========================================
  static getWorkerEarnings(workerId: number): EarningsSummary {
    const hired = this.getHiredWorkers().filter(h => h.workerId === workerId);
    
    // Seed standard base historical earnings records only for demo worker 201
    const standardPastRecords: EarningsRecord[] = workerId === 201 ? [
      {
        id: 'earn-rec-01',
        jobId: 101,
        jobTitle: 'Paddy Harvesting & Threshing',
        cropType: 'Paddy',
        farmerName: 'Murugan Farms (Ramesh K.)',
        date: '2026-09-01',
        wageAmount: 750,
        wageType: 'PER_DAY',
        durationDays: 3,
        totalEarned: 2250,
        paymentMode: 'UPI',
        paymentStatus: 'PAID'
      },
      {
        id: 'earn-rec-02',
        jobId: 102,
        jobTitle: 'Sugarcane Cane Cutting & Tractor Loading',
        cropType: 'Sugarcane',
        farmerName: 'Sakthi Sugars (Anand S.)',
        date: '2026-08-28',
        wageAmount: 850,
        wageType: 'PER_DAY',
        durationDays: 4,
        totalEarned: 3400,
        paymentMode: 'UPI',
        paymentStatus: 'PAID'
      },
      {
        id: 'earn-rec-03',
        jobId: 103,
        jobTitle: 'Cotton Hand Picking Shift',
        cropType: 'Cotton',
        farmerName: 'Kaveri Delta Agro',
        date: '2026-08-20',
        wageAmount: 700,
        wageType: 'PER_DAY',
        durationDays: 5,
        totalEarned: 3500,
        paymentMode: 'CASH',
        paymentStatus: 'PAID'
      },
      {
        id: 'earn-rec-04',
        jobId: 104,
        jobTitle: 'Tractor Tilling & Sowing Prep',
        cropType: 'Paddy',
        farmerName: 'Green Valley Organic',
        date: '2026-08-12',
        wageAmount: 1100,
        wageType: 'PER_DAY',
        durationDays: 3,
        totalEarned: 3300,
        paymentMode: 'UPI',
        paymentStatus: 'PAID'
      },
      {
        id: 'earn-rec-05',
        jobId: 105,
        jobTitle: 'Banana Trenching & Bunding',
        cropType: 'Banana',
        farmerName: 'Cauvery Orchards (Sundar)',
        date: '2026-08-04',
        wageAmount: 750,
        wageType: 'PER_DAY',
        durationDays: 4,
        totalEarned: 3000,
        paymentMode: 'UPI',
        paymentStatus: 'PAID'
      }
    ] : [];

    // Compute active dynamic hired records for this worker
    const dynamicRecords: EarningsRecord[] = hired.map(h => ({
      id: `earn-dyn-${h.id}`,
      jobId: h.jobId,
      jobTitle: h.jobTitle,
      cropType: 'Paddy',
      farmerName: h.farmerName,
      date: h.startDate,
      wageAmount: Number(h.dailyWage) || 750,
      wageType: 'PER_DAY',
      durationDays: Math.max(1, h.totalDaysPresent),
      totalEarned: Number(h.totalEarnings) || (Number(h.dailyWage) * h.totalDaysPresent) || 750,
      paymentMode: h.paymentMode || 'UPI',
      paymentStatus: h.status === 'PAID' ? 'PAID' : 'PENDING'
    }));

    const allRecords = [...dynamicRecords, ...standardPastRecords];
    
    // Numeric calculations strictly isolated
    let totalEarnings: number;
    let currentMonthEarnings: number;
    let completedJobsCount: number;
    let averageDailyWage: number;

    if (workerId === 201) {
      totalEarnings = allRecords.reduce((sum, r) => sum + (Number(r.totalEarned) || 0), 0) + 53700;
      currentMonthEarnings = allRecords
        .filter(r => r.date.startsWith('2026-09'))
        .reduce((sum, r) => sum + (Number(r.totalEarned) || 0), 0) + 16250;
      completedJobsCount = allRecords.length + 19;
      const totalDaysWorked = allRecords.reduce((sum, r) => sum + (Number(r.durationDays) || 1), 0) + 72;
      averageDailyWage = Math.round(totalEarnings / Math.max(1, totalDaysWorked)) || 756;
    } else {
      totalEarnings = allRecords.reduce((sum, r) => sum + (Number(r.totalEarned) || 0), 0);
      currentMonthEarnings = allRecords.reduce((sum, r) => sum + (Number(r.totalEarned) || 0), 0);
      completedJobsCount = allRecords.filter(r => r.paymentStatus === 'PAID').length;
      const totalDaysWorked = allRecords.reduce((sum, r) => sum + (Number(r.durationDays) || 1), 0);
      averageDailyWage = totalDaysWorked > 0 ? Math.round(totalEarnings / totalDaysWorked) : 0;
    }

    return {
      currentMonthEarnings,
      totalEarnings,
      completedJobsCount,
      averageDailyWage,
      records: allRecords
    };
  }

  // ==========================================
  // WORK CALENDAR (WORKER & FARMER)
  // ==========================================
  static getWorkCalendar(userId: number, role: UserRole, monthYear: string = '2026-09'): CalendarEvent[] {
    const events: CalendarEvent[] = [];
    const jobs = this.getJobs();
    const hired = this.getHiredWorkers();
    const apps = this.getApplications();

    if (role === 'WORKER') {
      // 1. Confirmed Hired Shifts
      hired.forEach(h => {
        if (h.workerId === userId || userId === 10 || userId === 201) {
          events.push({
            id: `cal-hired-${h.id}`,
            date: h.startDate,
            jobId: h.jobId,
            jobTitle: h.jobTitle,
            cropType: 'Paddy',
            workType: 'Harvesting',
            status: h.status === 'ACTIVE' ? 'ACTIVE' : 'COMPLETED',
            startTime: '07:00 AM',
            wageAmount: h.dailyWage,
            durationDays: h.totalDaysPresent || 3,
            location: h.workerLocation || 'Thiruvaiyaru, Thanjavur',
            farmerName: h.farmerName,
            farmerPhone: '+91 98401 23456'
          });
        }
      });

      // 2. Scheduled upcoming confirmed jobs
      events.push(
        {
          id: 'cal-event-01',
          date: '2026-09-05',
          jobId: 101,
          jobTitle: 'Paddy Harvesting & Threshing',
          cropType: 'Paddy',
          workType: 'Harvesting',
          status: 'UPCOMING',
          startTime: '07:00 AM',
          wageAmount: 750,
          durationDays: 3,
          location: 'Thiruvaiyaru, Thanjavur',
          farmerName: 'Murugan Farms (Ramesh K.)',
          farmerPhone: '+91 98401 23456'
        },
        {
          id: 'cal-event-02',
          date: '2026-09-06',
          jobId: 101,
          jobTitle: 'Paddy Harvesting & Bundle Binding',
          cropType: 'Paddy',
          workType: 'Harvesting',
          status: 'UPCOMING',
          startTime: '07:00 AM',
          wageAmount: 750,
          durationDays: 3,
          location: 'Thiruvaiyaru, Thanjavur',
          farmerName: 'Murugan Farms (Ramesh K.)',
          farmerPhone: '+91 98401 23456'
        },
        {
          id: 'cal-event-03',
          date: '2026-09-07',
          jobId: 101,
          jobTitle: 'Paddy Field Threshing & Granary Loading',
          cropType: 'Paddy',
          workType: 'Threshing',
          status: 'UPCOMING',
          startTime: '07:00 AM',
          wageAmount: 750,
          durationDays: 1,
          location: 'Thiruvaiyaru, Thanjavur',
          farmerName: 'Murugan Farms (Ramesh K.)',
          farmerPhone: '+91 98401 23456'
        },
        {
          id: 'cal-event-04',
          date: '2026-09-12',
          jobId: 102,
          jobTitle: 'Sugarcane Cutting & Loading Shift',
          cropType: 'Sugarcane',
          workType: 'Cutting',
          status: 'SCHEDULED',
          startTime: '06:30 AM',
          wageAmount: 850,
          durationDays: 2,
          location: 'Kumbakonam, Thanjavur',
          farmerName: 'Sakthi Sugars (Anand S.)',
          farmerPhone: '+91 97890 54321'
        },
        {
          id: 'cal-event-05',
          date: '2026-09-18',
          jobId: 104,
          jobTitle: 'Tractor Rotary Puddling Shift',
          cropType: 'Paddy',
          workType: 'Tractor operation',
          status: 'SCHEDULED',
          startTime: '06:00 AM',
          wageAmount: 1100,
          durationDays: 2,
          location: 'Papanasam, Thanjavur',
          farmerName: 'Green Valley Organic',
          farmerPhone: '+91 94432 11223'
        }
      );
    } else {
      // Farmer Work Calendar
      jobs.forEach(job => {
        events.push({
          id: `cal-farmer-${job.id}`,
          date: job.startDate,
          jobId: job.id,
          jobTitle: job.title,
          cropType: job.cropType,
          workType: job.workType,
          status: job.status === 'ACTIVE' ? 'ACTIVE' : 'SCHEDULED',
          startTime: job.workingHours.split('-')[0].trim() || '07:00 AM',
          wageAmount: job.wageAmount,
          durationDays: 4,
          location: job.villageTown + ', ' + job.district,
          workersCount: job.workersRequired,
          workersHired: job.workersHired
        });
      });
    }

    return events;
  }

  // ==========================================
  // UPCOMING WORK DISPATCH FOR WORKER DASHBOARD
  // ==========================================
  static getUpcomingWork(workerId: number): CalendarEvent | null {
    const calendar = this.getWorkCalendar(workerId, 'WORKER');
    // Filter events for tomorrow or nearest future date
    const upcoming = calendar.find(c => c.status === 'UPCOMING' || c.status === 'SCHEDULED' || c.status === 'ACTIVE');
    return upcoming || null;
  }

  // ==========================================
  // FARMER WORKFORCE OVERVIEW SUMMARY
  // ==========================================
  static getWorkforceSummary(farmerId: number = 1): WorkforceSummary {
    const jobs = this.getJobs().filter(j => j.farmerId === farmerId || farmerId === 1);
    const apps = this.getApplications().filter(a => a.farmerId === farmerId || farmerId === 1);
    
    const activeJobs = jobs.filter(j => j.status === 'ACTIVE').length;
    const workersNeeded = jobs.reduce((sum, j) => sum + Math.max(0, j.workersRequired - j.workersHired), 0);
    const workersHired = jobs.reduce((sum, j) => sum + j.workersHired, 0);
    const applicationsPending = apps.filter(a => a.status === 'APPLIED' || a.status === 'SHORTLISTED').length;
    const upcomingShiftsCount = activeJobs > 0 ? workersHired : 0;

    return {
      activeJobs,
      workersNeeded,
      workersHired,
      applicationsPending,
      upcomingShiftsCount
    };
  }

  // ==========================================
  // SMART JOB RECOMMENDATIONS (ML ENGINE / FALLBACK)
  // ==========================================
  static getJobRecommendations(workerId: number = 201): JobRecommendation[] {
    const jobs = this.getJobs();
    const worker = this.getCandidates().find(c => c.id === workerId) || this.getCandidates()[0];
    const workerSkills = worker?.skills || ['Harvesting', 'Paddy work', 'Tractor operation'];

    return jobs.map((job, idx) => {
      const reasons: string[] = [];
      let score = 70;

      // 1. Skill Match
      const matchedSkill = job.requiredSkills.find(s => workerSkills.includes(s));
      if (matchedSkill) {
        score += 15;
        reasons.push(`✓ Skill match: ${matchedSkill}`);
      } else {
        reasons.push('✓ General field experience match');
      }

      // 2. Availability
      if (worker.availabilityStatus === 'AVAILABLE') {
        score += 5;
        reasons.push('✓ Available for scheduled dates');
      }

      // 3. Proximity Distance
      const dist = job.distanceKm || (idx === 0 ? 3.2 : idx === 1 ? 7.5 : 11.0);
      if (dist <= 5) {
        score += 8;
        reasons.push(`✓ ${dist} km away (Close to your village)`);
      } else {
        reasons.push(`✓ ${dist} km away in ${job.district}`);
      }

      // 4. Rating & Reliability
      if (worker.rating >= 4.8) {
        score += 4;
        reasons.push(`✓ High reliability score (${worker.reliabilityScore}/100)`);
      }

      // 5. Work history similarity
      if (worker.mainCropsHandled?.includes(job.cropType)) {
        score += 5;
        reasons.push(`✓ Previous experience in ${job.cropType} cultivation`);
      }

      const matchPercentage = Math.min(98, Math.max(78, score));

      return {
        job,
        matchPercentage,
        matchReasons: reasons.slice(0, 5)
      };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);
  }

  // ==========================================
  // OFFLINE & CONNECTIVITY SYNCHRONIZATION
  // ==========================================
  static getLastSyncTimestamp(): string {
    return this.load<string>(STORAGE_KEYS.LAST_SYNC, '2026-09-01T09:30:00Z');
  }

  static syncOfflineData(): { syncedCount: number; timestamp: string } {
    const now = new Date().toISOString();
    this.save(STORAGE_KEYS.LAST_SYNC, now);
    return {
      syncedCount: this.getJobs().length + this.getApplications().length,
      timestamp: now
    };
  }

  static getUserSession(): UserSession | null {
    return this.load<UserSession | null>(STORAGE_KEYS.USER_SESSION, null);
  }

  static setUserSession(session: UserSession | null): void {
    this.save(STORAGE_KEYS.USER_SESSION, session);
  }

  static hasSeenIntro(): boolean {
    return this.load<boolean>(STORAGE_KEYS.INTRO_SEEN, false);
  }

  static setSeenIntro(seen: boolean): void {
    this.save(STORAGE_KEYS.INTRO_SEEN, seen);
  }

  // ==========================================
  // USER ACCOUNT REGISTRATION & AUTHENTICATION
  // ==========================================
  static getUsers(): UserAccount[] {
    return this.load<UserAccount[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  static findUserByEmail(email: string): UserAccount | null {
    if (!email) return null;
    const users = this.getUsers();
    const normalized = email.trim().toLowerCase();
    return users.find(u => u.email.trim().toLowerCase() === normalized) || null;
  }

  static findUserByMobile(mobile: string): UserAccount | null {
    if (!mobile) return null;
    const users = this.getUsers();
    const clean = mobile.replace(/[\s\-()]/g, '');
    return users.find(u => {
      const uClean = u.mobileNumber.replace(/[\s\-()]/g, '');
      return uClean.endsWith(clean.slice(-10)) || clean.endsWith(uClean.slice(-10));
    }) || null;
  }

  static findUserByIdentifier(identifier: string): UserAccount | null {
    if (!identifier) return null;
    const trimmed = identifier.trim();
    if (trimmed.includes('@')) {
      return this.findUserByEmail(trimmed);
    }
    return this.findUserByMobile(trimmed) || this.findUserByEmail(trimmed);
  }

  static async registerUser(data: {
    fullName: string;
    email: string;
    mobileNumber: string;
    password: string;
    role: UserRole;
    language?: LanguageCode;
    villageOrTown?: string;
    district?: string;
    state?: string;
    farmSizeAcres?: number;
    mainCrops?: string[];
    skills?: string[];
    termsAccepted: boolean;
  }): Promise<{ success: boolean; message: string; user?: UserAccount; token?: string }> {
    // Validate email format
    const trimmedEmail = data.email.trim().toLowerCase();
    if (this.findUserByEmail(trimmedEmail)) {
      return { success: false, message: 'An account with this email address already exists. Please login instead.' };
    }

    // Validate mobile number
    if (this.findUserByMobile(data.mobileNumber)) {
      return { success: false, message: 'An account with this mobile number already exists. Please login instead.' };
    }

    if (!data.termsAccepted) {
      return { success: false, message: 'You must accept the Terms & Conditions to register.' };
    }

    const users = this.getUsers();
    const newId = Math.max(1000, ...users.map(u => u.id)) + 1;
    const passwordHash = await hashPassword(data.password);

    const newUser: UserAccount = {
      id: newId,
      fullName: data.fullName.trim(),
      email: trimmedEmail,
      mobileNumber: data.mobileNumber.trim(),
      passwordHash,
      role: data.role,
      language: data.language || 'en',
      villageOrTown: data.villageOrTown || 'Thiruvaiyaru',
      district: data.district || 'Thanjavur',
      state: data.state || 'Tamil Nadu',
      farmSizeAcres: data.farmSizeAcres || (data.role === 'FARMER' ? 3.0 : undefined),
      mainCrops: data.mainCrops || (data.role === 'FARMER' ? ['Paddy'] : undefined),
      skills: data.skills || (data.role === 'WORKER' ? ['Harvesting', 'Paddy work'] : undefined),
      experienceYears: data.role === 'WORKER' ? 3 : undefined,
      dailyWageExpected: data.role === 'WORKER' ? 750 : undefined,
      reliabilityScore: 90,
      rating: 5.0,
      reviewCount: 0,
      availabilityStatus: 'AVAILABLE',
      avatar: data.role === 'FARMER'
        ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: data.role === 'FARMER' ? 'Farmer cultivating agricultural land in Cauvery Delta.' : 'Skilled agricultural laborer.',
      termsAccepted: data.termsAccepted,
      createdAt: new Date().toISOString()
    };

    const updated = [...users, newUser];
    this.save(STORAGE_KEYS.USERS, updated);

    // Isolated welcome notification strictly for this new user
    this.addNotification({
      title: `Welcome to FarmConnect AI, ${newUser.fullName}! 🌱`,
      message: `Your account is created as a ${newUser.role === 'FARMER' ? 'Farmer / Landowner' : 'Agricultural Laborer'}. You can now access your personalized dashboard.`,
      type: 'STATUS',
      recipientUserId: newUser.id
    });

    // Also register on backend server if running
    try {
      fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newUser,
          password: data.password
        })
      }).catch(() => {});
    } catch {}

    const token = `farmconnect_token_${newUser.id}_${Date.now()}`;
    return {
      success: true,
      message: 'Account created successfully! Please sign in with your credentials.',
      user: newUser,
      token
    };
  }

  static async authenticateUser(identifier: string, password: string): Promise<{
    success: boolean;
    message: string;
    user?: UserAccount;
    session?: UserSession;
    token?: string;
  }> {
    if (!identifier || !password) {
      return { success: false, message: 'Please provide both identifier and password.' };
    }

    const user = this.findUserByIdentifier(identifier);
    if (!user) {
      return { success: false, message: 'No registered account found with this email or mobile number.' };
    }

    // Support demo pre-seeded passwords 'Password@123' and 'Admin@1234'
    const isDemo = (user.id === 1 || user.id === 201) && password === 'Password@123';
    const isAdminDemo = user.id === 999 && (password === 'Admin@1234' || password === 'Password@123');

    const isValid = isDemo || isAdminDemo || (await verifyPassword(password, user.passwordHash));
    if (!isValid) {
      return { success: false, message: 'Incorrect password. Please verify and try again.' };
    }

    const token = `farmconnect_token_${user.id}_${Date.now()}`;
    const session = this.userAccountToSession(user, token);
    this.setUserSession(session);

    return {
      success: true,
      message: `Welcome back, ${user.fullName}!`,
      user,
      session,
      token
    };
  }

  static async resetPassword(identifier: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const user = this.findUserByIdentifier(identifier);
    if (!user) {
      return { success: false, message: 'User not found.' };
    }

    const newHash = await hashPassword(newPassword);
    const users = this.getUsers();
    const updated = users.map(u => u.id === user.id ? { ...u, passwordHash: newHash } : u);
    this.save(STORAGE_KEYS.USERS, updated);

    // Sync with server
    try {
      fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier,
          resetCode: '123456',
          newPassword
        })
      }).catch(() => {});
    } catch {}

    return { success: true, message: 'Password updated successfully! You can now log in.' };
  }

  static userAccountToSession(user: UserAccount, token: string): UserSession {
    return {
      token,
      userId: user.id,
      fullName: user.fullName,
      mobileNumber: user.mobileNumber,
      email: user.email,
      role: user.role,
      language: user.language || 'en',
      villageOrTown: user.villageOrTown,
      district: user.district,
      state: user.state,
      avatar: user.avatar,
      farmSizeAcres: user.farmSizeAcres,
      mainCrops: user.mainCrops,
      skills: user.skills,
      experienceYears: user.experienceYears,
      dailyWageExpected: user.dailyWageExpected,
      reliabilityScore: user.reliabilityScore,
      rating: user.rating,
      reviewCount: user.reviewCount,
      availabilityStatus: user.availabilityStatus,
      bio: user.bio,
      isVerified: true,
      joinedDate: user.createdAt
    };
  }

  static getLanguage(): LanguageCode {
    return this.load<LanguageCode>(STORAGE_KEYS.APP_LANGUAGE, 'en');
  }

  static setLanguage(lang: LanguageCode): void {
    this.save(STORAGE_KEYS.APP_LANGUAGE, lang);
  }
}

