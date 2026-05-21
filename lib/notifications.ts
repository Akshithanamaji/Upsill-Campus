// Notification Service for Traffic Alerts
// This service manages real-time notifications and alerts

export type NotificationType = 'info' | 'warning' | 'error' | 'success';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  dismissible: boolean;
}

class NotificationService {
  private notifications: Notification[] = [];
  private subscribers: ((notifications: Notification[]) => void)[] = [];
  private soundEnabled = true;

  subscribe(callback: (notifications: Notification[]) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notify() {
    this.subscribers.forEach(callback => callback(this.notifications));
  }

  addNotification(
    type: NotificationType,
    title: string,
    message: string,
    options?: {
      actionUrl?: string;
      dismissible?: boolean;
      duration?: number; // in seconds, 0 = never auto-dismiss
    }
  ): string {
    const id = `notification-${Date.now()}-${Math.random()}`;
    const notification: Notification = {
      id,
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      actionUrl: options?.actionUrl,
      dismissible: options?.dismissible ?? true
    };

    this.notifications.unshift(notification);
    this.notify();

    // Play sound if enabled
    if (this.soundEnabled && type !== 'info') {
      this.playNotificationSound();
    }

    // Auto-dismiss after duration
    if (options?.duration && options.duration > 0) {
      setTimeout(() => {
        this.dismissNotification(id);
      }, options.duration * 1000);
    }

    return id;
  }

  dismissNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notify();
  }

  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notify();
    }
  }

  clearAll() {
    this.notifications = [];
    this.notify();
  }

  getNotifications() {
    return this.notifications;
  }

  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  enableSound(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  private playNotificationSound() {
    // Play a subtle notification sound
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      // Audio context not available, silently fail
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Alert-specific helpers
export const alertUser = {
  highCongestion: (junctionName: string) =>
    notificationService.addNotification(
      'warning',
      'High Congestion Alert',
      `${junctionName} is experiencing severe congestion`,
      { duration: 10 }
    ),

  accidentDetected: (junctionName: string) =>
    notificationService.addNotification(
      'error',
      'Accident Detected',
      `Accident reported at ${junctionName}. Avoid this area if possible.`,
      { duration: 0 } // Don't auto-dismiss
    ),

  constructionWork: (junctionName: string, duration: string) =>
    notificationService.addNotification(
      'info',
      'Construction Work',
      `Road work at ${junctionName} for ${duration}. Expect delays.`,
      { duration: 10 }
    ),

  specialEvent: (eventName: string, location: string) =>
    notificationService.addNotification(
      'info',
      'Special Event Alert',
      `${eventName} at ${location} may affect traffic conditions.`,
      { duration: 10 }
    ),

  systemError: (errorMessage: string) =>
    notificationService.addNotification(
      'error',
      'System Error',
      errorMessage,
      { duration: 0 }
    ),

  dataUpdated: () =>
    notificationService.addNotification(
      'success',
      'Data Updated',
      'Traffic data has been refreshed',
      { duration: 3 }
    ),

  predictionReady: () =>
    notificationService.addNotification(
      'success',
      'Predictions Ready',
      'New traffic predictions have been generated',
      { duration: 5 }
    )
};
