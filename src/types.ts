export type LanguageCode = 'en' | 'ta' | 'hi' | 'te' | 'kn' | 'ml' | 'mr' | 'bn';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export type UserRole = 'FARMER' | 'WORKER' | 'ADMIN';

export type AvailabilityStatus = 'AVAILABLE' | 'BUSY' | 'PARTIALLY_AVAILABLE';

export interface ReviewItem {
  id: string;
  reviewerName: string;
  reviewerRole: 'FARMER' | 'WORKER';
  rating: number;
  date: string;
  comment: string;
  cropType?: string;
}

export interface UserSession {
  token: string;
  userId: number;
  mobileNumber: string;
  fullName: string;
  role: UserRole;
  language: LanguageCode;
  villageOrTown: string;
  district: string;
  state: string;
  farmSizeAcres?: number;
  mainCrops?: string[];
  skills?: string[];
  experienceYears?: number;
  dailyWageExpected?: number;
  reliabilityScore?: number;
  rating?: number;
  reviewCount?: number;
  availabilityStatus?: AvailabilityStatus;
  bio?: string;
  completedJobsCount?: number;
  totalEarnings?: number;
  email?: string;
  avatar?: string;
  isVerified?: boolean;
  joinedDate?: string;
  aadhaarNumberMasked?: string;
  pattaSurveyNo?: string;
  soilType?: string;
  irrigationSource?: string;
  upiId?: string;
  bankName?: string;
  bankAccountLast4?: string;
  toolsOwned?: string[];
  emergencyContact?: string;
}

export interface UserAccount {
  id: number;
  fullName: string;
  email: string;
  mobileNumber: string;
  passwordHash: string;
  role: UserRole;
  language: LanguageCode;
  villageOrTown: string;
  district: string;
  state: string;
  createdAt: string;
  avatar?: string;
  farmSizeAcres?: number;
  mainCrops?: string[];
  skills?: string[];
  experienceYears?: number;
  dailyWageExpected?: number;
  reliabilityScore?: number;
  rating?: number;
  reviewCount?: number;
  availabilityStatus?: AvailabilityStatus;
  bio?: string;
  termsAccepted: boolean;
}

export interface AdminMetrics {
  totalUsers: number;
  totalFarmers: number;
  totalWorkers: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  totalHired: number;
  totalWagesDisbursed: number;
  totalExpectedEarnings: number;
  openDisputes: number;
  platformHealth: string;
  activeRegion: string;
}

export interface DisputeRecord {
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

export interface JobItem {
  id: number;
  farmerId: number;
  farmerName: string;
  farmerPhone: string;
  farmerLocation: string;
  villageTown: string;
  district: string;
  state: string;
  title: string;
  cropType: string;
  workType: string;
  description: string;
  workersRequired: number;
  workersHired: number;
  wageAmount: number;
  wageType: 'PER_DAY' | 'PER_HOUR' | 'PER_ACRE' | 'PER_JOB';
  currency: string;
  startDate: string;
  endDate: string;
  workingHours: string;
  perks: string[];
  toolsProvided: boolean;
  requiredSkills: string[];
  distanceKm?: number;
  status: 'ACTIVE' | 'FILLED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export type ApplicationStatus = 'APPLIED' | 'SHORTLISTED' | 'HIRED' | 'REJECTED' | 'COMPLETED' | 'WITHDRAWN';

export interface JobApplication {
  id: string;
  jobId: number;
  jobTitle: string;
  cropType: string;
  farmerId: number;
  farmerName: string;
  farmerPhone: string;
  farmerLocation: string;
  workerId: number;
  workerName: string;
  workerPhone: string;
  workerSkills: string[];
  workerExperienceYears: number;
  workerReliabilityScore: number;
  workerRating: number;
  appliedWage: number;
  proposedWage?: number;
  message?: string;
  status: ApplicationStatus;
  appliedAt: string;
  startDate: string;
  endDate: string;
  matchScore: number; // ML recommendation match % (0-100)
}

export interface WorkerCandidate {
  id: number;
  fullName: string;
  avatarUrl?: string;
  gender?: 'MALE' | 'FEMALE';
  aadhaarVerified?: boolean;
  upiId?: string;
  bankAccountLast4?: string;
  bankName?: string;
  mobileNumber: string;
  villageTown: string;
  district: string;
  state: string;
  distanceKm: number;
  skills: string[];
  experienceYears: number;
  dailyRate: number;
  reliabilityScore: number;
  rating: number;
  reviewCount: number;
  availabilityStatus: AvailabilityStatus;
  mainCropsHandled: string[];
  toolsOwned?: string[];
  certifications?: string[];
  punctualityScore?: number;
  bio: string;
  reviews: ReviewItem[];
}

export interface AttendanceEntry {
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY';
  hoursWorked: number;
  recordedBy: string;
}

export interface HiredWorkerRecord {
  id: string;
  jobId: number;
  jobTitle: string;
  farmerId: number;
  farmerName: string;
  workerId: number;
  workerName: string;
  workerAvatar?: string;
  workerPhone: string;
  workerLocation: string;
  upiId?: string;
  bankAccountLast4?: string;
  bankName?: string;
  dailyWage: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PAID';
  attendance: AttendanceEntry[];
  totalDaysPresent: number;
  totalEarnings: number;
  paidAmount: number;
  paymentMode?: 'UPI' | 'CASH' | 'BANK_TRANSFER';
  paymentDate?: string;
  transactionRef?: string;
  farmerRating?: number;
  farmerReview?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'NEW_NEARBY_JOB' | 'JOB_APPLIED' | 'APPLICATION_ACCEPTED' | 'APPLICATION_REJECTED' | 'WORKER_HIRED' | 'UPCOMING_WORK' | 'JOB_REMINDER' | 'JOB_COMPLETED' | 'RATING_REMINDER' | 'PAYMENT' | 'ALERT' | 'STATUS';
  timestamp: string;
  read: boolean;
  relatedJobId?: number;
  relatedWorkerId?: number;
  relatedApplicationId?: string;
  jobId?: number;
  recipientUserId?: number;
}

export type AppNotification = NotificationItem;

export interface SavedJobItem {
  id: string;
  workerId: number;
  jobId: number;
  savedAt: string;
  job: JobItem;
}

export interface CalendarEvent {
  id: string;
  date: string;
  jobId: number;
  jobTitle: string;
  cropType: string;
  workType: string;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'SCHEDULED';
  startTime: string;
  wageAmount: number;
  durationDays: number;
  location: string;
  farmerName?: string;
  farmerPhone?: string;
  workersCount?: number;
  workersHired?: number;
}

export interface WorkforceSummary {
  activeJobs: number;
  workersNeeded: number;
  workersHired: number;
  applicationsPending: number;
  upcomingShiftsCount: number;
}

export interface EarningsRecord {
  id: string;
  jobId: number;
  jobTitle: string;
  cropType: string;
  farmerName: string;
  date: string;
  wageAmount: number;
  wageType: 'PER_DAY' | 'PER_HOUR' | 'PER_ACRE' | 'PER_JOB';
  durationDays: number;
  totalEarned: number;
  paymentMode: 'UPI' | 'CASH' | 'BANK_TRANSFER';
  paymentStatus: 'PAID' | 'PENDING' | 'PROCESSING';
}

export interface EarningsSummary {
  currentMonthEarnings: number;
  totalEarnings: number;
  completedJobsCount: number;
  averageDailyWage: number;
  records: EarningsRecord[];
}

export interface JobRecommendation {
  job: JobItem;
  matchPercentage: number;
  matchReasons: string[];
}

export interface WageEstimationResult {
  cropType: string;
  workType: string;
  location: string;
  recommendedDailyWage: number;
  wageRange: { min: number; max: number };
  estimatedWorkersNeeded: number;
  estimatedDurationDays: number;
  totalEstimatedBudget: number;
  currency: string;
  marketTrend: string;
  factors: string[];
}

