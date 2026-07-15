import apiClient from './apiClient';

export interface AnalyticsData {
  totalIncidents: number;
  resolvedIncidents: number;
  inProgressIncidents: number;
  criticalIncidents: number;
  lastUpdated: string;
}

class AnalyticsService {
  async getAnalytics(): Promise<AnalyticsData> {
    try {
      const response = await apiClient.get('/analytics');
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();
