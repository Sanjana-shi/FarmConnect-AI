import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
  MapPin, Clock, IndianRupee, Phone, CheckCircle2, AlertCircle, 
  Briefcase, Users, Sparkles, FileText, Check
} from 'lucide-react';
import { CalendarEvent, LanguageCode, UserRole } from '../../types';
import { FarmConnectStore } from '../../data/store';
import { GoogleKeepService, FieldNoteItem } from '../../services/googleKeepService';

interface WorkCalendarScreenProps {
  userId: number;
  role: UserRole;
  selectedLanguage: LanguageCode;
  onBack: () => void;
  onSelectJob: (jobId: number) => void;
  onFindJobs?: () => void;
  onManageJobs?: () => void;
}

export const WorkCalendarScreen: React.FC<WorkCalendarScreenProps> = ({
  userId,
  role,
  selectedLanguage,
  onBack,
  onSelectJob,
  onFindJobs,
  onManageJobs
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-05');
  const [currentMonth, setCurrentMonth] = useState<{ month: number; year: number }>({ month: 8, year: 2026 }); // 0-indexed: 8 is September
  const [isKeepConfigured, setIsKeepConfigured] = useState<boolean>(() => GoogleKeepService.isConfigured());
  const [fieldNotes, setFieldNotes] = useState<FieldNoteItem[]>(() => GoogleKeepService.getFieldNotes());
  const [isSyncingKeep, setIsSyncingKeep] = useState<boolean>(false);
  const [keepSyncStatus, setKeepSyncStatus] = useState<string | null>(null);

  const events: CalendarEvent[] = FarmConnectStore.getWorkCalendar(userId, role);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Dynamic calendar matrix generation for current month and year
  const daysInMonth = new Date(currentMonth.year, currentMonth.month + 1, 0).getDate();
  const firstDayIndex = new Date(currentMonth.year, currentMonth.month, 1).getDay();

  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const m = currentMonth.month + 1;
    const formattedDate = `${currentMonth.year}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`;
    calendarDays.push(formattedDate);
  }

  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      if (prev.month === 0) return { month: 11, year: prev.year - 1 };
      return { month: prev.month - 1, year: prev.year };
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      if (prev.month === 11) return { month: 0, year: prev.year + 1 };
      return { month: prev.month + 1, year: prev.year };
    });
  };

  const handleSyncNotes = async () => {
    if (!isKeepConfigured) return;
    setIsSyncingKeep(true);
    setKeepSyncStatus(null);
    try {
      const res = await GoogleKeepService.syncNotesToKeep();
      setKeepSyncStatus(res.message);
      setFieldNotes(GoogleKeepService.getFieldNotes());
      setTimeout(() => setKeepSyncStatus(null), 3500);
    } catch (err: any) {
      setKeepSyncStatus(err.message || 'Sync failed');
    } finally {
      setIsSyncingKeep(false);
    }
  };

  // Filter events for the currently selected date
  const selectedDateEvents = events.filter(e => e.date === selectedDate);

  const getStatusBadge = (status: CalendarEvent['status']) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[9px] rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>In Progress</span>
          </span>
        );
      case 'UPCOMING':
        return (
          <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[9px] rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5 text-amber-700" />
            <span>Confirmed</span>
          </span>
        );
      case 'SCHEDULED':
        return (
          <span className="px-2 py-0.5 bg-blue-100 text-blue-900 border border-blue-300 font-bold text-[9px] rounded-full">
            Scheduled
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold text-[9px] rounded-full">
            Completed
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between py-1 overflow-y-auto animate-fadeIn">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <button 
              onClick={onBack}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {role === 'WORKER' ? 'Work Schedule Calendar' : 'Field Operations Calendar'}
              </h2>
              <span className="text-[10px] text-emerald-700 font-semibold">
                {events.length} confirmed shifts in September 2026
              </span>
            </div>
          </div>
        </div>

        {/* Month Selector Bar */}
        <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <button 
            onClick={handlePrevMonth}
            className="p-1 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="text-center">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 justify-center">
              <CalendarIcon className="w-3.5 h-3.5 text-emerald-700" />
              {monthNames[currentMonth.month]} {currentMonth.year}
            </span>
            <span className="text-[9px] text-slate-500 font-medium">Kuruvai Harvest & Sowing Season</span>
          </div>

          <div className="flex items-center gap-1">
            {/* Google Keep Integration: If not configured, hide "Sync notes" option until ready */}
            {isKeepConfigured && (
              <button
                onClick={handleSyncNotes}
                disabled={isSyncingKeep}
                title="Sync farm schedule and field notes to Google Keep"
                className="px-2 py-1 bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
              >
                <FileText className="w-3 h-3 text-amber-700" />
                <span>{isSyncingKeep ? 'Syncing...' : 'Sync notes'}</span>
              </button>
            )}

            <button 
              onClick={handleNextMonth}
              className="p-1 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {keepSyncStatus && (
          <div className="p-2 bg-emerald-800 text-white text-[11px] font-bold rounded-xl text-center shadow-xs animate-fadeIn flex items-center justify-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-amber-300" />
            <span>{keepSyncStatus}</span>
          </div>
        )}

        {/* Interactive Calendar Matrix */}
        <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
          {/* Day of week headers */}
          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((dateStr, idx) => {
              if (!dateStr) {
                return <div key={`empty-${idx}`} className="h-9 rounded-lg opacity-0" />;
              }

              const dayNum = parseInt(dateStr.split('-')[2], 10);
              const dayEvents = events.filter(e => e.date === dateStr);
              const hasWork = dayEvents.length > 0;
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-9 rounded-xl flex flex-col items-center justify-center relative transition-all text-xs font-semibold ${
                    isSelected 
                      ? 'bg-emerald-800 text-white shadow-xs scale-105 z-10' 
                      : hasWork 
                        ? 'bg-emerald-50 text-emerald-950 border border-emerald-300 font-bold' 
                        : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-[11px]">{dayNum}</span>
                  {hasWork && (
                    <span className="flex items-center gap-0.5 mt-0.5">
                      {dayEvents.map(e => (
                        <span 
                          key={e.id} 
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected 
                              ? 'bg-amber-300' 
                              : e.status === 'ACTIVE' 
                                ? 'bg-emerald-600' 
                                : e.status === 'UPCOMING' 
                                  ? 'bg-amber-500' 
                                  : 'bg-blue-500'
                          }`}
                        />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div className="flex items-center justify-center gap-3 pt-2 border-t border-slate-100 text-[9px] text-slate-600">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Active</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Confirmed</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Scheduled</span>
            </div>
          </div>
        </div>

        {/* Selected Date Detail Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-bold text-slate-900">
              Schedule for {new Date(selectedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </h3>
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
              {selectedDateEvents.length} {selectedDateEvents.length === 1 ? 'Shift' : 'Shifts'}
            </span>
          </div>

          {selectedDateEvents.length === 0 ? (
            <div className="p-6 bg-white border border-slate-200 rounded-2xl text-center space-y-2">
              <span className="text-2xl">🌱</span>
              <p className="text-xs font-bold text-slate-800">No shifts scheduled for this date</p>
              <p className="text-[10px] text-slate-500">
                {role === 'WORKER' 
                  ? 'Your schedule is free on this date. You can explore nearby harvesting jobs.'
                  : 'No active field operations scheduled for this date.'}
              </p>
              {role === 'WORKER' && onFindJobs && (
                <button
                  onClick={onFindJobs}
                  className="px-3 py-1.5 bg-emerald-800 text-white rounded-xl text-[11px] font-bold shadow-xs hover:bg-emerald-900"
                >
                  Find Farm Jobs
                </button>
              )}
              {role === 'FARMER' && onManageJobs && (
                <button
                  onClick={onManageJobs}
                  className="px-3 py-1.5 bg-emerald-800 text-white rounded-xl text-[11px] font-bold shadow-xs hover:bg-emerald-900"
                >
                  Post New Field Job
                </button>
              )}
            </div>
          ) : (
            selectedDateEvents.map(event => (
              <div
                key={event.id}
                className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2 hover:border-emerald-600 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-bold rounded uppercase">
                      {event.cropType} • {event.workType}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1">{event.jobTitle}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{event.location}</span>
                    </p>
                  </div>
                  {getStatusBadge(event.status)}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[10px]">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Starts at {event.startTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold justify-end">
                    <IndianRupee className="w-3.5 h-3.5" />
                    <span>₹{event.wageAmount} / day</span>
                  </div>
                </div>

                {role === 'WORKER' && event.farmerName && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="text-[10px] text-slate-600">
                      <span className="font-semibold text-slate-800">{event.farmerName}</span>
                    </div>
                    <div className="flex gap-1.5">
                      {event.farmerPhone && (
                        <a
                          href={`tel:${event.farmerPhone}`}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                          title={`Call ${event.farmerName}`}
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call</span>
                        </a>
                      )}
                      <button
                        onClick={() => onSelectJob(event.jobId)}
                        className="px-2.5 py-1 bg-emerald-800 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-900"
                      >
                        View Job
                      </button>
                    </div>
                  </div>
                )}

                {role === 'FARMER' && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                    <div className="text-slate-600 flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      <span>{event.workersHired || 4} of {event.workersCount || 6} workers assembled</span>
                    </div>
                    <button
                      onClick={() => onSelectJob(event.jobId)}
                      className="px-2.5 py-1 bg-emerald-800 text-white rounded-lg text-[10px] font-bold"
                    >
                      Manage Job
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
