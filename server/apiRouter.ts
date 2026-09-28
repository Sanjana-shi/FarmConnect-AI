import { Router, Request, Response } from 'express';
import { 
  ServerUser, INITIAL_SERVER_USERS, 
  ServerOtp, ServerDispute, INITIAL_SERVER_DISPUTES 
} from './data';

export const apiRouter = Router();

// In-Memory persistent collections
let users: ServerUser[] = [...INITIAL_SERVER_USERS];
let otps: Map<string, ServerOtp> = new Map();
let disputes: ServerDispute[] = [...INITIAL_SERVER_DISPUTES];

let serverJobs: any[] = [
  {
    id: 101,
    farmerId: 1,
    farmerName: 'Ramesh K. (Murugan Farms)',
    farmerPhone: '+919840123456',
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
    farmerId: 1,
    farmerName: 'Kaveri Delta Agro (Senthil Nathan)',
    farmerPhone: '+919789054321',
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
    farmerPhone: '+919443211223',
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
  }
];

let serverApplications: any[] = [
  {
    id: 'app-101-201',
    jobId: 101,
    jobTitle: 'Paddy Harvesting & Threshing',
    cropType: 'Paddy',
    farmerId: 1,
    farmerName: 'Ramesh K. (Murugan Farms)',
    farmerPhone: '+919840123456',
    farmerLocation: 'Thiruvaiyaru, Thanjavur (3.2 km away)',
    workerId: 201,
    workerName: 'Murugesan V.',
    workerPhone: '+919840567890',
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
  }
];

let serverHiredRecords: any[] = [
  {
    id: 'hired-1',
    jobId: 101,
    jobTitle: 'Paddy Harvesting & Threshing',
    farmerId: 1,
    farmerName: 'Ramesh K. (Murugan Farms)',
    workerId: 201,
    workerName: 'Murugesan V.',
    workerPhone: '+919840567890',
    workerLocation: 'Thiruvaiyaru (2.1 km away)',
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
  }
];

let serverNotifications: any[] = [
  {
    id: 'notif-1',
    title: 'Welcome to FarmConnect AI! 🌾',
    message: 'Your account is verified. You can now connect directly with regional farmers and workers.',
    type: 'STATUS',
    timestamp: 'Just now',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Harvest Season Demand Alert 📢',
    message: 'Paddy harvest labor wage index updated to ₹750/day in Thanjavur district.',
    type: 'ALERT',
    timestamp: '2 hours ago',
    read: false
  }
];

let serverAuditLogs: any[] = [
  {
    id: 'log-1',
    timestamp: new Date().toISOString(),
    action: 'SYSTEM_BOOT',
    details: 'FarmConnect AI backend engine initialized with regional Indian agri seed.'
  }
];

function logAudit(action: string, details: string) {
  serverAuditLogs.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    timestamp: new Date().toISOString(),
    action,
    details
  });
  if (serverAuditLogs.length > 100) serverAuditLogs.pop();
}

// ----------------------------------------------------
// AUTHENTICATION & USER MANAGEMENT
// ----------------------------------------------------

// 1. Send OTP (Mobile / Email)
apiRouter.post('/auth/send-otp', (req: Request, res: Response) => {
  const { mobileNumber, email } = req.body;
  const target = mobileNumber || email;

  if (!target) {
    return res.status(400).json({ success: false, message: 'Mobile number or email is required.' });
  }

  // Generate 6-digit OTP code
  const code = '123456'; // Consistent test OTP for development & quick preview verification
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

  otps.set(target, {
    mobileOrEmail: target,
    otpCode: code,
    expiresAt,
    attempts: 0,
    verified: false
  });

  logAudit('AUTH_SEND_OTP', `Dispatched OTP verification code to ${target}`);

  return res.json({
    success: true,
    message: `OTP sent successfully to ${target}`,
    data: {
      target,
      devOtpNotice: 'Default preview test OTP is 123456',
      expiresInSeconds: 300
    }
  });
});

// 2. Verify OTP
apiRouter.post('/auth/verify-otp', (req: Request, res: Response) => {
  const { mobileNumber, email, otpCode } = req.body;
  const target = mobileNumber || email;

  if (!target || !otpCode) {
    return res.status(400).json({ success: false, message: 'Target and OTP code are required.' });
  }

  const record = otps.get(target);
  if (!record) {
    // Check if test code was provided directly
    if (otpCode === '123456') {
      otps.set(target, {
        mobileOrEmail: target,
        otpCode: '123456',
        expiresAt: Date.now() + 300000,
        attempts: 1,
        verified: true
      });
    } else {
      return res.status(400).json({ success: false, message: 'OTP expired or not found. Please request a new OTP.' });
    }
  } else {
    if (Date.now() > record.expiresAt) {
      otps.delete(target);
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }
    if (record.otpCode !== otpCode && otpCode !== '123456') {
      record.attempts += 1;
      return res.status(400).json({ success: false, message: 'Invalid OTP code. Please verify and retry.' });
    }
    record.verified = true;
  }

  // Find user by mobile or email
  const existing = users.find(u => u.mobileNumber === target || u.email === target);
  logAudit('AUTH_VERIFY_OTP', `Successfully verified OTP for ${target}`);

  return res.json({
    success: true,
    message: 'OTP verified successfully',
    data: {
      isRegistered: !!existing,
      user: existing || null,
      token: existing ? `farmconnect_jwt_${existing.id}_${Date.now()}` : null
    }
  });
});

// 3. Register New Account (Farmer / Worker / Admin)
apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { 
    fullName, mobileNumber, email, role, password, pin,
    villageOrTown, district, state, farmSizeAcres, mainCrops,
    skills, experienceYears, dailyWageExpected, bio, language
  } = req.body;

  if (!fullName || !mobileNumber || !role) {
    return res.status(400).json({ success: false, message: 'Full Name, Mobile Number, and Role are required.' });
  }

  // Normalize mobile
  const cleanMobile = mobileNumber.startsWith('+91') ? mobileNumber : `+91${mobileNumber.replace(/^0+/, '')}`;

  // Check duplicate
  const duplicate = users.find(u => u.mobileNumber === cleanMobile || (email && u.email === email));
  if (duplicate) {
    return res.status(409).json({ 
      success: false, 
      message: 'An account with this mobile number or email already exists. Please log in instead.' 
    });
  }

  const newId = Math.max(...users.map(u => u.id), 100) + 1;
  const newUser: ServerUser = {
    id: newId,
    fullName: fullName.trim(),
    email: email || `${cleanMobile.replace('+', '')}@farmconnect.in`,
    mobileNumber: cleanMobile,
    password: password || 'Password@123',
    pin: pin || '1234',
    role: role.toUpperCase() as any,
    language: language || 'en',
    villageOrTown: villageOrTown || 'Thiruvaiyaru',
    district: district || 'Thanjavur',
    state: state || 'Tamil Nadu',
    avatar: role === 'FARMER'
      ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    farmSizeAcres: farmSizeAcres ? Number(farmSizeAcres) : undefined,
    mainCrops: mainCrops || (role === 'FARMER' ? ['Paddy'] : undefined),
    skills: skills || (role === 'WORKER' ? ['Harvesting', 'Paddy work'] : undefined),
    experienceYears: experienceYears ? Number(experienceYears) : (role === 'WORKER' ? 5 : undefined),
    dailyWageExpected: dailyWageExpected ? Number(dailyWageExpected) : 750,
    reliabilityScore: 95,
    rating: 5.0,
    reviewCount: 1,
    availabilityStatus: 'AVAILABLE',
    bio: bio || (role === 'FARMER' ? 'Farmer managing agricultural cultivation.' : 'Skilled agricultural laborer.'),
    isVerified: true,
    isActive: true,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  logAudit('USER_REGISTERED', `New ${newUser.role} registered: ${newUser.fullName} (${newUser.mobileNumber})`);

  // Add notification
  serverNotifications.unshift({
    id: `notif-${Date.now()}`,
    title: `Welcome ${newUser.fullName}! 🌱`,
    message: `Your ${newUser.role} profile is created. Explore nearby opportunities and workforce networks in ${newUser.district}.`,
    type: 'STATUS',
    timestamp: 'Just now',
    read: false
  });

  return res.status(201).json({
    success: true,
    message: 'Account registered successfully',
    data: {
      user: newUser,
      token: `farmconnect_jwt_${newUser.id}_${Date.now()}`
    }
  });
});

// 4. Login (Password / PIN / OTP)
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { identifier, password, pin, otpCode } = req.body;

  if (!identifier) {
    return res.status(400).json({ success: false, message: 'Mobile number or email is required.' });
  }

  const cleanMobile = identifier.startsWith('+91') ? identifier : `+91${identifier.replace(/^0+/, '')}`;
  const user = users.find(u => u.mobileNumber === identifier || u.mobileNumber === cleanMobile || u.email === identifier);

  if (!user) {
    return res.status(404).json({ success: false, message: 'No registered user found with these details.' });
  }

  if (!user.isActive) {
    return res.status(403).json({ success: false, message: 'This account is suspended. Please contact platform administration.' });
  }

  // Verify credentials
  let isValid = false;
  if (otpCode === '123456') {
    isValid = true;
  } else if (password && user.password && user.password === password) {
    isValid = true;
  } else if (pin && user.pin && user.pin === pin) {
    isValid = true;
  } else if (otpCode) {
    const record = otps.get(identifier) || otps.get(cleanMobile);
    if (record && record.otpCode === otpCode) {
      isValid = true;
    }
  }

  if (!isValid) {
    return res.status(401).json({ success: false, message: 'Invalid password, PIN, or OTP. Please check and retry.' });
  }

  logAudit('AUTH_LOGIN_SUCCESS', `User logged in: ${user.fullName} (${user.role})`);

  return res.json({
    success: true,
    message: 'Login successful',
    data: {
      user,
      token: `farmconnect_jwt_${user.id}_${Date.now()}`
    }
  });
});

// 5. Forgot Password: Send Reset Token
apiRouter.post('/auth/forgot-password', (req: Request, res: Response) => {
  const { identifier } = req.body;
  if (!identifier) {
    return res.status(400).json({ success: false, message: 'Please enter your registered mobile number or email.' });
  }

  const cleanMobile = identifier.startsWith('+91') ? identifier : `+91${identifier.replace(/^0+/, '')}`;
  const user = users.find(u => u.mobileNumber === identifier || u.mobileNumber === cleanMobile || u.email === identifier);

  if (!user) {
    return res.status(404).json({ success: false, message: 'No account registered with this mobile number or email.' });
  }

  const resetCode = '123456';
  otps.set(user.mobileNumber, {
    mobileOrEmail: user.mobileNumber,
    otpCode: resetCode,
    expiresAt: Date.now() + 600000,
    attempts: 0,
    verified: false
  });

  logAudit('AUTH_FORGOT_PW', `Password reset initiated for ${user.fullName} (${user.mobileNumber})`);

  return res.json({
    success: true,
    message: `Security verification code sent to ${user.mobileNumber}`,
    data: {
      mobileNumber: user.mobileNumber,
      devNotice: 'Verification security code is 123456'
    }
  });
});

// 6. Reset Password / PIN
apiRouter.post('/auth/reset-password', (req: Request, res: Response) => {
  const { identifier, resetCode, newPassword, newPin } = req.body;

  if (!identifier || !resetCode || (!newPassword && !newPin)) {
    return res.status(400).json({ success: false, message: 'Identifier, security code, and new password or PIN are required.' });
  }

  const cleanMobile = identifier.startsWith('+91') ? identifier : `+91${identifier.replace(/^0+/, '')}`;
  const user = users.find(u => u.mobileNumber === identifier || u.mobileNumber === cleanMobile || u.email === identifier);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  if (resetCode !== '123456') {
    const record = otps.get(user.mobileNumber);
    if (!record || record.otpCode !== resetCode) {
      return res.status(400).json({ success: false, message: 'Invalid or expired security code.' });
    }
  }

  if (newPassword) user.password = newPassword;
  if (newPin) user.pin = newPin;

  logAudit('AUTH_RESET_PW_SUCCESS', `Password/PIN updated for user: ${user.fullName}`);

  return res.json({
    success: true,
    message: 'Password / Security PIN reset successfully. You can now log in with your new credentials.',
    data: { user }
  });
});

// 7. Update User Profile
apiRouter.put('/auth/profile', (req: Request, res: Response) => {
  const { userId, updates } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: 'User ID is required.' });
  }

  const user = users.find(u => u.id === Number(userId));
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  Object.assign(user, updates);
  logAudit('USER_PROFILE_UPDATED', `Profile updated for ${user.fullName}`);

  return res.json({
    success: true,
    message: 'Profile updated successfully',
    data: { user }
  });
});

// ----------------------------------------------------
// JOBS API
// ----------------------------------------------------

// GET all jobs with search & filters
apiRouter.get('/jobs', (req: Request, res: Response) => {
  const { 
    search, crop, workType, district, 
    minWage, maxWage, farmerId, status 
  } = req.query;

  let results = [...serverJobs];

  if (status) {
    results = results.filter(j => j.status === status);
  }

  if (farmerId) {
    results = results.filter(j => j.farmerId === Number(farmerId));
  }

  if (crop && crop !== 'ALL') {
    results = results.filter(j => j.cropType.toLowerCase() === (crop as string).toLowerCase());
  }

  if (workType && workType !== 'ALL') {
    results = results.filter(j => j.workType.toLowerCase() === (workType as string).toLowerCase());
  }

  if (district && district !== 'ALL') {
    results = results.filter(j => j.district.toLowerCase().includes((district as string).toLowerCase()));
  }

  if (minWage) {
    results = results.filter(j => j.wageAmount >= Number(minWage));
  }

  if (maxWage) {
    results = results.filter(j => j.wageAmount <= Number(maxWage));
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(j => 
      j.title.toLowerCase().includes(q) ||
      j.cropType.toLowerCase().includes(q) ||
      j.description.toLowerCase().includes(q) ||
      j.villageTown.toLowerCase().includes(q) ||
      j.district.toLowerCase().includes(q)
    );
  }

  return res.json({
    success: true,
    count: results.length,
    data: results
  });
});

// GET single job
apiRouter.get('/jobs/:id', (req: Request, res: Response) => {
  const job = serverJobs.find(j => j.id === Number(req.params.id));
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }
  return res.json({ success: true, data: job });
});

// POST Create Job
apiRouter.post('/jobs', (req: Request, res: Response) => {
  const { 
    farmerId, farmerName, farmerPhone, farmerLocation,
    title, cropType, workType, description, workersRequired,
    wageAmount, wageType, startDate, endDate, workingHours,
    perks, toolsProvided, requiredSkills, villageTown, district, state
  } = req.body;

  if (!title || !cropType || !wageAmount || !workersRequired) {
    return res.status(400).json({ success: false, message: 'Title, Crop Type, Wage Amount, and Required Workers are mandatory.' });
  }

  const newId = Math.max(...serverJobs.map(j => j.id), 100) + 1;
  const newJob = {
    id: newId,
    farmerId: Number(farmerId) || 1,
    farmerName: farmerName || 'Murugan Farms (Ramesh K.)',
    farmerPhone: farmerPhone || '+919840123456',
    farmerLocation: farmerLocation || `${villageTown || 'Thiruvaiyaru'}, ${district || 'Thanjavur'}`,
    villageTown: villageTown || 'Thiruvaiyaru',
    district: district || 'Thanjavur',
    state: state || 'Tamil Nadu',
    title,
    cropType,
    workType: workType || 'Harvesting',
    description: description || 'Seasonal field operations.',
    workersRequired: Number(workersRequired),
    workersHired: 0,
    wageAmount: Number(wageAmount),
    wageType: wageType || 'PER_DAY',
    currency: 'INR',
    startDate: startDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
    endDate: endDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    workingHours: workingHours || '07:00 AM - 02:30 PM',
    perks: perks || ['Lunch & Morning Tea', 'Daily Payout'],
    toolsProvided: toolsProvided !== undefined ? toolsProvided : true,
    requiredSkills: requiredSkills || ['Harvesting', 'Field work'],
    distanceKm: 2.5,
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  };

  serverJobs.unshift(newJob);
  logAudit('JOB_POSTED', `New job posted by ${newJob.farmerName}: ${newJob.title} (₹${newJob.wageAmount}/day)`);

  serverNotifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'New Job Broadcasted! 📢',
    message: `"${newJob.title}" posted for ${newJob.cropType}. Nearby workers have been notified.`,
    type: 'STATUS',
    timestamp: 'Just now',
    read: false
  });

  return res.status(201).json({
    success: true,
    message: 'Farm job posted and broadcasted successfully',
    data: newJob
  });
});

// PUT Update Job
apiRouter.put('/jobs/:id', (req: Request, res: Response) => {
  const job = serverJobs.find(j => j.id === Number(req.params.id));
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }
  Object.assign(job, req.body);
  return res.json({ success: true, message: 'Job updated successfully', data: job });
});

// DELETE Job
apiRouter.delete('/jobs/:id', (req: Request, res: Response) => {
  const index = serverJobs.findIndex(j => j.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }
  serverJobs.splice(index, 1);
  return res.json({ success: true, message: 'Job deleted successfully' });
});

// ----------------------------------------------------
// APPLICATIONS API
// ----------------------------------------------------

// GET Applications
apiRouter.get('/applications', (req: Request, res: Response) => {
  const { jobId, workerId, farmerId } = req.query;
  let results = [...serverApplications];

  if (jobId) results = results.filter(a => a.jobId === Number(jobId));
  if (workerId) results = results.filter(a => a.workerId === Number(workerId));
  if (farmerId) results = results.filter(a => a.farmerId === Number(farmerId));

  return res.json({ success: true, count: results.length, data: results });
});

// POST Apply for Job
apiRouter.post('/jobs/:id/apply', (req: Request, res: Response) => {
  const jobId = Number(req.params.id);
  const job = serverJobs.find(j => j.id === jobId);
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }

  const { workerId, workerName, workerPhone, proposedWage, message } = req.body;

  const existing = serverApplications.find(a => a.jobId === jobId && a.workerId === Number(workerId));
  if (existing) {
    return res.status(400).json({ success: false, message: 'You have already applied for this job.' });
  }

  const newApp = {
    id: `app-${jobId}-${workerId}-${Date.now()}`,
    jobId,
    jobTitle: job.title,
    cropType: job.cropType,
    farmerId: job.farmerId,
    farmerName: job.farmerName,
    farmerPhone: job.farmerPhone,
    farmerLocation: job.farmerLocation,
    workerId: Number(workerId) || 201,
    workerName: workerName || 'Murugesan V.',
    workerPhone: workerPhone || '+919840567890',
    workerSkills: ['Harvesting', 'Paddy work'],
    workerExperienceYears: 7,
    workerReliabilityScore: 96,
    workerRating: 4.9,
    appliedWage: Number(proposedWage) || job.wageAmount,
    proposedWage: Number(proposedWage) || job.wageAmount,
    message: message || 'Experienced worker ready to start.',
    status: 'APPLIED',
    appliedAt: new Date().toISOString(),
    startDate: job.startDate,
    endDate: job.endDate,
    matchScore: 96
  };

  serverApplications.unshift(newApp);
  logAudit('JOB_APPLIED', `${newApp.workerName} applied for ${job.title}`);

  serverNotifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'New Applicant Received! 🤝',
    message: `${newApp.workerName} applied for "${job.title}" at ₹${newApp.appliedWage}/day.`,
    type: 'JOB_APPLIED',
    timestamp: 'Just now',
    read: false
  });

  return res.status(201).json({
    success: true,
    message: 'Application submitted successfully to farmer',
    data: newApp
  });
});

// PUT Application Status (HIRED, REJECTED, SHORTLISTED)
apiRouter.put('/applications/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  const app = serverApplications.find(a => a.id === req.params.id);

  if (!app) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }

  app.status = status;

  if (status === 'HIRED') {
    // Increase hired count on job
    const job = serverJobs.find(j => j.id === app.jobId);
    if (job) {
      job.workersHired = Math.min(job.workersRequired, job.workersHired + 1);
      if (job.workersHired >= job.workersRequired) {
        job.status = 'FILLED';
      }
    }

    // Create hired contract record
    const newHired = {
      id: `hired-${Date.now()}`,
      jobId: app.jobId,
      jobTitle: app.jobTitle,
      farmerId: app.farmerId,
      farmerName: app.farmerName,
      workerId: app.workerId,
      workerName: app.workerName,
      workerPhone: app.workerPhone,
      workerLocation: app.farmerLocation,
      dailyWage: app.appliedWage,
      startDate: app.startDate,
      endDate: app.endDate,
      status: 'ACTIVE',
      attendance: [
        { date: new Date().toISOString().split('T')[0], status: 'PRESENT', hoursWorked: 7.5, recordedBy: app.farmerName }
      ],
      totalDaysPresent: 1,
      totalEarnings: app.appliedWage,
      paidAmount: 0
    };
    serverHiredRecords.unshift(newHired);

    serverNotifications.unshift({
      id: `notif-${Date.now()}`,
      title: 'Congratulations! You are Hired 🎉',
      message: `${app.farmerName} confirmed your hiring for "${app.jobTitle}". Starting ${app.startDate}.`,
      type: 'WORKER_HIRED',
      timestamp: 'Just now',
      read: false
    });
  }

  return res.json({ success: true, message: `Application status updated to ${status}`, data: app });
});

// ----------------------------------------------------
// HIRED WORKERS & ATTENDANCE API
// ----------------------------------------------------

apiRouter.get('/hired', (req: Request, res: Response) => {
  const { farmerId, workerId } = req.query;
  let results = [...serverHiredRecords];
  if (farmerId) results = results.filter(h => h.farmerId === Number(farmerId));
  if (workerId) results = results.filter(h => h.workerId === Number(workerId));
  return res.json({ success: true, data: results });
});

apiRouter.post('/hired/:id/attendance', (req: Request, res: Response) => {
  const { status, date } = req.body;
  const hired = serverHiredRecords.find(h => h.id === req.params.id);
  if (!hired) {
    return res.status(404).json({ success: false, message: 'Hired record not found' });
  }

  const today = date || new Date().toISOString().split('T')[0];
  hired.attendance = hired.attendance.filter((a: any) => a.date !== today);
  const hours = status === 'PRESENT' ? 7.5 : status === 'HALF_DAY' ? 4.0 : 0;
  hired.attendance.push({ date: today, status, hoursWorked: hours, recordedBy: hired.farmerName });

  const presentDays = hired.attendance.filter((a: any) => a.status === 'PRESENT').length +
                      (hired.attendance.filter((a: any) => a.status === 'HALF_DAY').length * 0.5);
  hired.totalDaysPresent = presentDays;
  hired.totalEarnings = Math.round(presentDays * hired.dailyWage);

  return res.json({ success: true, message: 'Attendance marked', data: hired });
});

apiRouter.post('/hired/:id/payment', (req: Request, res: Response) => {
  const { amount, paymentMode } = req.body;
  const hired = serverHiredRecords.find(h => h.id === req.params.id);
  if (!hired) {
    return res.status(404).json({ success: false, message: 'Hired record not found' });
  }

  hired.paidAmount += Number(amount);
  hired.paymentMode = paymentMode || 'UPI';
  hired.paymentDate = new Date().toISOString();
  if (hired.paidAmount >= hired.totalEarnings) {
    hired.status = 'PAID';
  }

  serverNotifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'Payment Disbursed! 💰',
    message: `Payment of ₹${amount} made to ${hired.workerName} via ${hired.paymentMode}.`,
    type: 'PAYMENT',
    timestamp: 'Just now',
    read: false
  });

  return res.json({ success: true, message: 'Payment recorded successfully', data: hired });
});

// ----------------------------------------------------
// NOTIFICATIONS API
// ----------------------------------------------------

apiRouter.get('/notifications', (req: Request, res: Response) => {
  return res.json({ success: true, data: serverNotifications });
});

apiRouter.put('/notifications/:id/read', (req: Request, res: Response) => {
  const notif = serverNotifications.find(n => n.id === req.params.id);
  if (notif) notif.read = true;
  return res.json({ success: true, data: notif });
});

apiRouter.put('/notifications/read-all', (req: Request, res: Response) => {
  serverNotifications.forEach(n => { n.read = true; });
  return res.json({ success: true, message: 'All notifications marked as read' });
});

apiRouter.delete('/notifications/clear-all', (req: Request, res: Response) => {
  serverNotifications = [];
  return res.json({ success: true, message: 'Notifications cleared' });
});

// ----------------------------------------------------
// ADMIN & MODERATION API
// ----------------------------------------------------

apiRouter.get('/admin/metrics', (req: Request, res: Response) => {
  const totalUsers = users.length;
  const totalFarmers = users.filter(u => u.role === 'FARMER').length;
  const totalWorkers = users.filter(u => u.role === 'WORKER').length;
  const totalJobs = serverJobs.length;
  const activeJobs = serverJobs.filter(j => j.status === 'ACTIVE').length;
  const totalApplications = serverApplications.length;
  const totalHired = serverApplications.filter(a => a.status === 'HIRED').length;
  const totalWagesDisbursed = serverHiredRecords.reduce((acc, h) => acc + (h.paidAmount || 0), 0);
  const totalExpectedEarnings = serverHiredRecords.reduce((acc, h) => acc + (h.totalEarnings || 0), 0);

  return res.json({
    success: true,
    data: {
      totalUsers,
      totalFarmers,
      totalWorkers,
      totalJobs,
      activeJobs,
      totalApplications,
      totalHired,
      totalWagesDisbursed,
      totalExpectedEarnings,
      openDisputes: disputes.filter(d => d.status === 'OPEN').length,
      platformHealth: 'OPTIMAL (100% Uptime)',
      activeRegion: 'Cauvery Delta & Pan-India Agri Network'
    }
  });
});

apiRouter.get('/admin/users', (req: Request, res: Response) => {
  return res.json({ success: true, count: users.length, data: users });
});

apiRouter.put('/admin/users/:id/status', (req: Request, res: Response) => {
  const { isActive, isVerified } = req.body;
  const user = users.find(u => u.id === Number(req.params.id));
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  if (isActive !== undefined) user.isActive = isActive;
  if (isVerified !== undefined) user.isVerified = isVerified;
  logAudit('ADMIN_USER_STATUS_CHANGE', `User ${user.fullName} status modified by Admin`);
  return res.json({ success: true, message: 'User updated by admin', data: user });
});

apiRouter.get('/admin/disputes', (req: Request, res: Response) => {
  return res.json({ success: true, data: disputes });
});

apiRouter.put('/admin/disputes/:id/resolve', (req: Request, res: Response) => {
  const { resolutionNote, status } = req.body;
  const dispute = disputes.find(d => d.id === req.params.id);
  if (!dispute) {
    return res.status(404).json({ success: false, message: 'Dispute not found' });
  }
  dispute.status = status || 'RESOLVED';
  dispute.resolutionNote = resolutionNote || 'Resolved via mediation';
  logAudit('ADMIN_DISPUTE_RESOLVED', `Dispute ${dispute.id} resolved: ${dispute.resolutionNote}`);
  return res.json({ success: true, message: 'Dispute updated', data: dispute });
});

apiRouter.get('/admin/audit-logs', (req: Request, res: Response) => {
  return res.json({ success: true, data: serverAuditLogs });
});
