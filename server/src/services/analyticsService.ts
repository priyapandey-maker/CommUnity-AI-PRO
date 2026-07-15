import { incidentStore } from '../models/IncidentStore';

export interface AnalyticsData {
  totalIncidents: number;
  resolvedIncidents: number;
  inProgressIncidents: number;
  criticalIncidents: number;
  lastUpdated: Date;
}

class AnalyticsService {
  private currentAnalytics: AnalyticsData = {
    totalIncidents: 0,
    resolvedIncidents: 0,
    inProgressIncidents: 0,
    criticalIncidents: 0,
    lastUpdated: new Date()
  };

  public refreshAnalytics(): AnalyticsData {
    const totalIncidents = incidentStore.length;
    const resolvedIncidents = incidentStore.filter(i => i.status === 'Resolved').length;
    const inProgressIncidents = incidentStore.filter(i => i.status === 'In Progress').length;
    const criticalIncidents = incidentStore.filter(i => i.priority === 'CRITICAL').length;

    this.currentAnalytics = {
      totalIncidents,
      resolvedIncidents,
      inProgressIncidents,
      criticalIncidents,
      lastUpdated: new Date()
    };
    
    // In a real system, this might trigger a WebSocket broadcast or update a Redis cache
    console.log(`[Analytics] Refreshed: ${totalIncidents} total, ${resolvedIncidents} resolved, ${criticalIncidents} critical.`);
    
    return this.currentAnalytics;
  }
  
  public getAnalytics(): AnalyticsData {
    return this.currentAnalytics;
  }
}

export const analyticsService = new AnalyticsService();
