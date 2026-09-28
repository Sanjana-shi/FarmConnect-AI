import React, { useState } from 'react';
import { X, Bell, CheckCircle2, ChevronRight, Clock, Trash2, Check, Filter } from 'lucide-react';
import { NotificationItem, LanguageCode } from '../../types';

interface NotificationsModalProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAllRead: () => void;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onSelectNotification: (notif: NotificationItem) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  notifications,
  onClose,
  onMarkAllRead,
  onMarkRead,
  onDelete,
  onClearAll,
  onSelectNotification
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNREAD' | 'PAYMENT' | 'JOBS'>('ALL');

  const filtered = notifications.filter(n => {
    if (activeFilter === 'UNREAD') return !n.read;
    if (activeFilter === 'PAYMENT') return n.type === 'PAYMENT';
    if (activeFilter === 'JOBS') return n.type === 'WORKER_HIRED' || n.type === 'APPLICATION_ACCEPTED' || n.type === 'APPLICATION_REJECTED';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs z-50 p-4 flex flex-col justify-end animate-fadeIn">
      <div className="bg-white rounded-3xl p-4 space-y-3 shadow-2xl animate-slideUp text-slate-900 max-h-[88%] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-emerald-800" />
            <h3 className="text-xs font-bold text-slate-900">Notification Center</h3>
            {unreadCount > 0 && (
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.2 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="text-[10px] text-emerald-800 hover:underline font-bold"
              >
                Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-[10px] text-slate-500 hover:text-red-700 font-medium"
              >
                Clear all
              </button>
            )}
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] font-semibold no-scrollbar">
          {(['ALL', 'UNREAD', 'PAYMENT', 'JOBS'] as const).map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-2.5 py-1 rounded-xl whitespace-nowrap transition-all ${
                activeFilter === f 
                  ? 'bg-emerald-800 text-white font-bold' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f === 'ALL' ? 'All' : f === 'UNREAD' ? 'Unread' : f === 'PAYMENT' ? 'Payments' : 'Job Updates'}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto space-y-2 text-xs">
          {filtered.length === 0 ? (
            <div className="p-8 text-center space-y-1 text-slate-500">
              <span className="text-2xl">🔔</span>
              <p className="text-xs font-bold">No notifications to show</p>
              <p className="text-[10px] text-slate-400">All caught up with field job alerts and payouts.</p>
            </div>
          ) : (
            filtered.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  if (!notif.read) onMarkRead(notif.id);
                  onSelectNotification(notif);
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer relative group ${
                  notif.read ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-emerald-50/70 border-emerald-300 text-slate-900 shadow-xs'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    {!notif.read && <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>}
                    <span className="line-clamp-1">{notif.title}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[9px] text-slate-400">{notif.timestamp}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(notif.id);
                      }}
                      className="p-1 text-slate-300 hover:text-red-600 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 mt-1 leading-snug">{notif.message}</p>

                {notif.relatedJobId && (
                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-emerald-800 font-bold">
                    <span>View Connected Job</span>
                    <ChevronRight className="w-3 h-3" />
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

