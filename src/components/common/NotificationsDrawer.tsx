import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCheck, X, AlertCircle, Info, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export const NotificationsDrawer: React.FC = () => {
  const {
    isNotificationsDrawerOpen,
    setIsNotificationsDrawerOpen,
    notifications,
    activeRole,
    activePatientId,
    activeNurseId,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useApp();

  if (!isNotificationsDrawerOpen) return null;

  // Filter notifications relevant to current role & user
  const relevantNotifications = notifications.filter((n) => {
    if (activeRole === 'admin') {
      return n.targetRole === 'admin' || n.targetRole === 'all';
    }
    if (activeRole === 'patient') {
      return (
        (n.targetRole === 'patient' && (!n.targetUserId || n.targetUserId === activePatientId)) ||
        n.targetRole === 'all'
      );
    }
    if (activeRole === 'nurse') {
      return (
        (n.targetRole === 'nurse' && (!n.targetUserId || n.targetUserId === activeNurseId)) ||
        n.targetRole === 'all'
      );
    }
    return true;
  });

  const unreadCount = relevantNotifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsNotificationsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                <Bell size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                <p className="text-xs text-slate-500">
                  {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-xs text-teal-700 hover:text-teal-900 font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-teal-50"
                  title="Mark all as read"
                >
                  <CheckCheck size={14} /> Mark all read
                </button>
              )}
              <button
                onClick={() => setIsNotificationsDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
            {relevantNotifications.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Bell size={32} className="mx-auto mb-2 opacity-40 text-slate-400" />
                <p className="text-sm">No notifications right now</p>
              </div>
            ) : (
              relevantNotifications.map((notif) => {
                const getIcon = () => {
                  switch (notif.type) {
                    case 'alert':
                      return <AlertCircle size={16} className="text-rose-600" />;
                    case 'warning':
                      return <AlertTriangle size={16} className="text-amber-600" />;
                    case 'success':
                      return <CheckCircle2 size={16} className="text-teal-600" />;
                    case 'info':
                    default:
                      return <Info size={16} className="text-sky-600" />;
                  }
                };

                return (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationAsRead(notif.id)}
                    className={`p-3.5 rounded-lg transition-colors cursor-pointer ${
                      !notif.read ? 'bg-teal-50/40 hover:bg-teal-50/70' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">{getIcon()}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <h4 className="text-xs font-semibold text-slate-900 truncate">
                            {notif.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                            {new Date(notif.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                        {notif.linkRequestId && (
                          <div className="mt-2 text-[11px] font-medium text-teal-700 flex items-center gap-1">
                            <span>Request Ref: {notif.linkRequestId}</span>
                            <ArrowRight size={10} />
                          </div>
                        )}
                      </div>
                      {!notif.read && (
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0 mt-1.5" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
