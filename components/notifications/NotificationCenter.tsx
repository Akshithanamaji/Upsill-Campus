'use client';

import { useEffect, useState } from 'react';
import { notificationService, Notification } from '@/lib/notifications';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

    const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = notificationService.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-950 border-l-4 border-l-red-500';
      case 'warning':
        return 'bg-orange-950 border-l-4 border-l-orange-500';
      case 'success':
        return 'bg-green-950 border-l-4 border-l-green-500';
      default:
        return 'bg-blue-950 border-l-4 border-l-blue-500';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 space-y-3 z-50 max-w-sm">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`rounded-lg p-4 shadow-lg animate-in fade-in slide-in-from-right-5 ${getBackgroundColor(notification.type)}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(notification.type)}
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-sm">
                {notification.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {notification.message}
              </p>
              <p suppressHydrationWarning className="text-xs text-muted-foreground mt-2 opacity-70">
                {mounted ? notification.timestamp.toLocaleTimeString('en-US') : '--:--'}
              </p>
            </div>

            {notification.dismissible && (
              <Button
                variant="ghost"
                size="sm"
                className="flex-shrink-0 -mr-2 -mt-1"
                onClick={() => notificationService.dismissNotification(notification.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = notificationService.subscribe(notifications => {
      setNotifications(notifications);
      setUnreadCount(notifications.filter(n => !n.read).length);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 hover:bg-sidebar rounded-lg transition-colors"
      >
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
        )}
        <svg
          className="w-5 h-5 text-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </button>

      {showPanel && (
        <div className="absolute right-0 mt-2 w-80 bg-sidebar border border-sidebar-border rounded-lg shadow-lg z-10">
          <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => notificationService.clearAll()}
              >
                Clear All
              </Button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No notifications
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className="p-3 border-b border-sidebar-border hover:bg-background/50 cursor-pointer transition-colors"
                  onClick={() => notificationService.markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p suppressHydrationWarning className="text-xs text-muted-foreground mt-2 opacity-70">
                        {mounted ? notification.timestamp.toLocaleTimeString('en-US') : '--:--'}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getIcon(type: string) {
  switch (type) {
    case 'error':
      return <AlertCircle className="w-4 h-4 text-red-400" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-orange-400" />;
    case 'success':
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    default:
      return <Info className="w-4 h-4 text-blue-400" />;
  }
}
