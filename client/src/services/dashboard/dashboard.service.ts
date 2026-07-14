import { DashboardState } from './dashboard.types';
import { mockDashboardData } from './dashboard.mock';

/**
 * Service abstraction for the Authority Dashboard.
 * Currently uses mock data. Can be swapped to real API calls later
 * without affecting the UI components.
 */
class DashboardService {
  async getDashboardState(): Promise<DashboardState> {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockDashboardData);
      }, 800);
    });
  }
}

export const dashboardService = new DashboardService();
