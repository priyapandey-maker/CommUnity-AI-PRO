export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'STATUS_CHANGE' | 'ASSIGNMENT' | 'RESOLUTION' | 'SYSTEM';
  isRead: boolean;
  createdAt: Date;
  incidentId?: string;
}

class NotificationService {
  private notifications: Notification[] = [];

  public createNotification(
    userId: string,
    message: string,
    type: Notification['type'],
    incidentId?: string
  ): Notification {
    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      message,
      type,
      isRead: false,
      createdAt: new Date(),
      incidentId
    };
    this.notifications.push(notification);
    return notification;
  }

  public getUserNotifications(userId: string): Notification[] {
    return this.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  public markAsRead(id: string, userId: string): Notification | null {
    const notification = this.notifications.find(n => n.id === id && n.userId === userId);
    if (notification) {
      notification.isRead = true;
      return notification;
    }
    return null;
  }
}

export const notificationService = new NotificationService();
