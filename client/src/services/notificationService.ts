import apiClient from './apiClient';

export interface AppNotification {
  id: string;
  userId: string;
  message: string;
  type: 'STATUS_CHANGE' | 'ASSIGNMENT' | 'RESOLUTION' | 'SYSTEM' | 'DECISION';
  isRead: boolean;
  createdAt: string;
  incidentId?: string;
}

class NotificationService {
  async getNotifications(): Promise<AppNotification[]> {
    try {
      const response = await apiClient.get('/notifications');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  async markAsRead(id: string): Promise<AppNotification> {
    try {
      const response = await apiClient.patch(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
