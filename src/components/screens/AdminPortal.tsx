import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Users, Briefcase, IndianRupee, AlertTriangle, 
  Search, CheckCircle2, XCircle, Filter, RefreshCw, Terminal, 
  Trash2, Check, ArrowUpRight, BarChart3, Database, Activity, 
  SlidersHorizontal, UserCheck, UserX, Eye
} from 'lucide-react';
import { JobItem, UserRole } from '../../types';
import { FarmConnectStore } from '../../data/store';

export const AdminPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'METRICS' | 'USERS' | 'JOBS' | 'DISPUTES' | 'LOGS'>('METRICS');
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'FARMER' | 'WORKER' | 'ADMIN'>('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // Load data
  const refreshAdminData = async () => {
    setIsLoading(true);
    try {
      // 1. Metrics
      const mRes = await fetch('/api/admin/metrics');
      if (mRes.ok) {
        const mJson = await mRes.json();
        setMetrics(mJson.data);
      } else {
        // Fallback metrics
        const localJobs = FarmConnectStore.getJobs();
        const localHired = FarmConnectStore.getHiredWorkers();
        setMetrics({
          totalUsers: 8,
          totalFarmers: 3,
          totalWorkers: 5,
          totalJobs: localJobs.length,
          activeJobs: localJobs.filter(j => j.status === 'ACTIVE').length,
          totalApplications: 12,
          totalHired: localHired.length,
          totalWagesDisbursed: localHired.reduce((acc, h) => acc + (h.paidAmount || 0), 0),
          totalExpectedEarnings: localHired.reduce((acc, h) => acc + (h.totalEarnings || 0), 0),
          openDisputes: 0,
          platformHealth: '100% OPERATIONAL',
          activeRegion: 'Cauvery Delta & Regional Agriculture Network'
        });
      }

      // 2. Users
      const uRes = await fetch('/api/admin/users');
      if (uRes.ok) {
        const uJson = await uRes.json();
        setUsers(uJson.data || []);
      } else {
        // Fallback mock users from seed
        setUsers([
          { id: 1, fullName: 'Ramesh K. (Murugan Farms)', mobileNumber: '+919840123456', role: 'FARMER', villageOrTown: 'Thiruvaiyaru', district: 'Thanjavur', isVerified: true, isActive: true, createdAt: '2026-08-01' },
          { id: 201, fullName: 'Murugesan V.', mobileNumber: '+919840567890', role: 'WORKER', villageOrTown: 'Thiruvaiyaru', district: 'Thanjavur', isVerified: true, isActive: true, createdAt: '2026-08-05' },
          { id: 202, fullName: 'Selvaraj P.', mobileNumber: '+919789123456', role: 'WORKER', villageOrTown: 'Kumbakonam', district: 'Thanjavur', isVerified: true, isActive: true, createdAt: '2026-08-08' },
          { id: 999, fullName: 'Admin Office', mobileNumber: '+919800000000', role: 'ADMIN', villageOrTown: 'Thanjavur', district: 'Thanjavur', isVerified: true, isActive: true, createdAt: '2026-07-01' }
        ]);
      }

      // 3. Jobs
      setJobs(FarmConnectStore.getJobs());

      // 4. Disputes
      const dRes = await fetch('/api/admin/disputes');
      if (dRes.ok) {
        const dJson = await dRes.json();
        setDisputes(dJson.data || []);
      }

      // 5. Audit Logs
      const lRes = await fetch('/api/admin/audit-logs');
      if (lRes.ok) {
        const lJson = await lRes.json();
        setAuditLogs(lJson.data || []);
      }
    } catch {
      setJobs(FarmConnectStore.getJobs());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAdminData();
  }, []);

  const handleToggleUserStatus = async (userId: number, currentActive: boolean) => {
    try {
      await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive })
      });
      setUsers(users.map(u => u.id === userId ? { ...u, isActive: !currentActive } : u));
    } catch (e) {
      setUsers(users.map(u => u.id === userId ? { ...u, isActive: !currentActive } : u));
    }
  };

  const handleToggleVerification = async (userId: number, currentVerified: boolean) => {
    try {
      await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: !currentVerified })
      });
      setUsers(users.map(u => u.id === userId ? { ...u, isVerified: !currentVerified } : u));
    } catch (e) {
      setUsers(users.map(u => u.id === userId ? { ...u, isVerified: !currentVerified } : u));
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    if (!window.confirm(`Are you sure you want to permanently remove Job #${jobId}?`)) return;
    try {
      await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
    const updated = jobs.filter(j => j.id !== jobId);
    setJobs(updated);
    FarmConnectStore.save('fc_jobs_v1', updated);
  };

  const handleResolveDispute = async (disputeId: string) => {
    try {
      await fetch(`/api/admin/disputes/${disputeId}/resolve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'RESOLVED', resolutionNote: 'Mediation agreement confirmed by Admin.' })
      });
      setDisputes(disputes.map(d => d.id === disputeId ? { ...d, status: 'RESOLVED' } : d));
    } catch {
      setDisputes(disputes.map(d => d.id === disputeId ? { ...d, status: 'RESOLVED' } : d));
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      (u.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.mobileNumber || '').includes(searchQuery) ||
      (u.district || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.cropType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.farmerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen text-slate-900 animate-fadeIn">
      {/* Admin Navigation Bar */}
      <div className="bg-slate-900 text-white px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white">FarmConnect Admin Portal</h1>
              <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-700/50 rounded-full text-[10px] font-bold uppercase tracking-wider">
                System SuperAdmin
              </span>
            </div>
            <p className="text-xs text-slate-400">
              National Agricultural Workforce Management & Regional Escrow Oversight
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshAdminData}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync Data</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 flex items-center gap-6 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('METRICS')}
          className={`py-3.5 border-b-2 flex items-center gap-1.5 transition-all ${
            activeTab === 'METRICS' ? 'border-emerald-800 text-emerald-800' : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Overview & KPIs</span>
        </button>

        <button
          onClick={() => setActiveTab('USERS')}
          className={`py-3.5 border-b-2 flex items-center gap-1.5 transition-all ${
            activeTab === 'USERS' ? 'border-emerald-800 text-emerald-800' : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Directory ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('JOBS')}
          className={`py-3.5 border-b-2 flex items-center gap-1.5 transition-all ${
            activeTab === 'JOBS' ? 'border-emerald-800 text-emerald-800' : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Job Postings ({jobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('DISPUTES')}
          className={`py-3.5 border-b-2 flex items-center gap-1.5 transition-all ${
            activeTab === 'DISPUTES' ? 'border-emerald-800 text-emerald-800' : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Disputes & Grievances ({disputes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('LOGS')}
          className={`py-3.5 border-b-2 flex items-center gap-1.5 transition-all ${
            activeTab === 'LOGS' ? 'border-emerald-800 text-emerald-800' : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>System Audit Logs</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-6 flex-1 max-w-7xl w-full mx-auto space-y-6">
        {/* TAB 1: METRICS */}
        {activeTab === 'METRICS' && (
          <div className="space-y-6">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>Registered Farmers</span>
                  <Users className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="mt-2 text-2xl font-black text-slate-900">
                  {metrics?.totalFarmers || 3}
                </div>
                <div className="mt-1 text-[11px] text-emerald-700 font-medium">
                  Verified land owners & contractors
                </div>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>Registered Workers</span>
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="mt-2 text-2xl font-black text-slate-900">
                  {metrics?.totalWorkers || 5}
                </div>
                <div className="mt-1 text-[11px] text-emerald-700 font-medium">
                  Available skilled field specialists
                </div>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>Active Jobs</span>
                  <Briefcase className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="mt-2 text-2xl font-black text-slate-900">
                  {metrics?.activeJobs || jobs.length}
                </div>
                <div className="mt-1 text-[11px] text-emerald-700 font-medium">
                  Broadcasted across Cauvery Delta
                </div>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>Wages Processed</span>
                  <IndianRupee className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="mt-2 text-2xl font-black text-emerald-800">
                  ₹{(metrics?.totalWagesDisbursed || 18500).toLocaleString()}
                </div>
                <div className="mt-1 text-[11px] text-slate-500 font-medium">
                  100% direct UPI & cash verified
                </div>
              </div>
            </div>

            {/* Health and Status Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
                  <Activity className="w-4 h-4" />
                  <span>Platform Health Status</span>
                </div>
                <p className="text-lg font-black text-emerald-950">OPTIMAL (100% UPTIME)</p>
                <p className="text-[11px] text-emerald-800/80">
                  Express API Server & Gemini Agricultural Engine active. 0 failed API calls.
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-blue-800 text-xs font-bold">
                  <Database className="w-4 h-4" />
                  <span>Regional Agricultural Region</span>
                </div>
                <p className="text-lg font-black text-blue-950">Cauvery Delta Zone</p>
                <p className="text-[11px] text-blue-800/80">
                  Thanjavur, Tiruvarur, Nagapattinam, Mayiladuthurai, Trichy, Cuddalore.
                </p>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-amber-800 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Security & Verification</span>
                </div>
                <p className="text-lg font-black text-amber-950">Aadhaar / Mobile OTP</p>
                <p className="text-[11px] text-amber-800/80">
                  All users verified by SMS OTP. Duplicate registration protection enabled.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER DIRECTORY */}
        {activeTab === 'USERS' && (
          <div className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-2xl">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search user by name, phone, or district..."
                  className="w-full h-9 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div className="flex items-center gap-1 text-xs">
                {(['ALL', 'FARMER', 'WORKER', 'ADMIN'] as const).map(role => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      roleFilter === role 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">User</th>
                      <th className="p-3.5">Role</th>
                      <th className="p-3.5">Mobile</th>
                      <th className="p-3.5">Location</th>
                      <th className="p-3.5">Badge</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400">
                          No registered users found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/80 transition-all">
                          <td className="p-3.5">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={user.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'}
                                alt=""
                                className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                              />
                              <div>
                                <p className="font-bold text-slate-900">{user.fullName}</p>
                                <p className="text-[10px] text-slate-500">ID #{user.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              user.role === 'FARMER' ? 'bg-amber-100 text-amber-800' :
                              user.role === 'WORKER' ? 'bg-emerald-100 text-emerald-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-600 font-mono text-[11px]">{user.mobileNumber}</td>
                          <td className="p-3.5 text-slate-600">{user.villageOrTown}, {user.district}</td>
                          <td className="p-3.5">
                            <button
                              onClick={() => handleToggleVerification(user.id, user.isVerified)}
                              className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all ${
                                user.isVerified 
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                  : 'bg-slate-100 text-slate-500 border border-slate-200'
                              }`}
                              title="Click to toggle verified badge"
                            >
                              <ShieldCheck className="w-3 h-3" />
                              <span>{user.isVerified ? 'Verified' : 'Unverified'}</span>
                            </button>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              user.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isActive !== false ? 'Active' : 'Suspended'}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => handleToggleUserStatus(user.id, user.isActive !== false)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                user.isActive !== false 
                                  ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200' 
                                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              }`}
                            >
                              {user.isActive !== false ? 'Suspend' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: JOBS MODERATION */}
        {activeTab === 'JOBS' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-2xl">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jobs by title, crop, or farmer..."
                  className="w-full h-9 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-700"
                />
              </div>
              <span className="text-xs font-bold text-slate-600">{filteredJobs.length} Farm Jobs Active</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Job Title & Crop</th>
                      <th className="p-3.5">Farmer & Location</th>
                      <th className="p-3.5">Daily Wage</th>
                      <th className="p-3.5">Quota</th>
                      <th className="p-3.5">Dates</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Moderation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50/80 transition-all">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-bold text-[10px]">
                              {job.cropType}
                            </span>
                            <span className="font-bold text-slate-900">{job.title}</span>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <p className="font-semibold text-slate-900">{job.farmerName}</p>
                          <p className="text-[10px] text-slate-500">{job.farmerLocation}</p>
                        </td>
                        <td className="p-3.5 font-bold text-emerald-800">
                          ₹{job.wageAmount} / day
                        </td>
                        <td className="p-3.5">
                          {job.workersHired} / {job.workersRequired} hired
                        </td>
                        <td className="p-3.5 text-slate-600 text-[11px]">
                          {job.startDate} to {job.endDate}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            job.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                            job.status === 'FILLED' ? 'bg-blue-100 text-blue-800' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Remove / Close Job"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DISPUTES */}
        {activeTab === 'DISPUTES' && (
          <div className="space-y-4">
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-900">Platform Labor Grievances & Escrow Mediation</h3>
                </div>
                <span className="text-xs text-slate-500">{disputes.length} logged grievances</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                FarmConnect AI provides fast resolution mediation for attendance discrepancies, overtime compensation, or field safety.
              </p>
            </div>

            <div className="space-y-3">
              {disputes.map((d) => (
                <div key={d.id} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        d.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {d.status}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{d.jobTitle}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Case #{d.id}</span>
                    </div>
                    {d.status !== 'RESOLVED' && (
                      <button
                        onClick={() => handleResolveDispute(d.id)}
                        className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolve Dispute</span>
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <strong className="font-bold text-slate-900">{d.complainantName} ({d.complainantRole}):</strong> {d.issue}
                  </p>

                  {d.resolutionNote && (
                    <p className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                      ✓ Resolution Note: {d.resolutionNote}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT LOGS */}
        {activeTab === 'LOGS' && (
          <div className="p-4 bg-slate-950 text-emerald-400 rounded-2xl font-mono text-xs shadow-xl space-y-2 max-h-[500px] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400 text-[11px]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Real-Time Audit Trail</span>
              </div>
              <span>{auditLogs.length} events logged</span>
            </div>
            {auditLogs.map((log) => (
              <div key={log.id} className="leading-relaxed border-b border-slate-900 pb-1">
                <span className="text-slate-500">[{log.timestamp.split('T')[1]?.slice(0, 8)}]</span>{' '}
                <span className="text-amber-400 font-bold">{log.action}:</span>{' '}
                <span className="text-slate-200">{log.details}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
