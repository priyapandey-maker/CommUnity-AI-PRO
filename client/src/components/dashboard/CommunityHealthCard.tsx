import { CommunityHealth } from '@/services/dashboard/dashboard.types';
import { HealthScoreChart } from './charts';

interface CommunityHealthCardProps {
  health: CommunityHealth;
}

export function CommunityHealthCard({ health }: CommunityHealthCardProps) {
  return (
    <div className="civic-card p-6">
      <h2 className="section-label mb-4">Community Health Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        <div className="md:col-span-1">
          <HealthScoreChart score={health.healthScore} />
        </div>
        
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 bg-surface-2 dark:bg-surface-2/50 rounded-lg border border-line">
            <p className="text-sm text-text-secondary">Active Incidents</p>
            <p className="text-3xl font-bold text-text-primary mt-1">{health.activeIncidents}</p>
          </div>
          
          <div className="p-4 bg-surface-2 dark:bg-surface-2/50 rounded-lg border border-line">
            <p className="text-sm text-text-secondary">Resolved Today</p>
            <p className="text-3xl font-bold text-text-primary mt-1">{health.resolvedToday}</p>
          </div>
          
          <div className="p-4 bg-surface-2 dark:bg-surface-2/50 rounded-lg border border-line">
            <p className="text-sm text-text-secondary">Avg Response</p>
            <div className="flex items-baseline gap-1 mt-1">
              <p className="text-3xl font-bold text-text-primary">{health.averageResponseTimeMinutes}</p>
              <span className="text-sm text-text-tertiary">min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
