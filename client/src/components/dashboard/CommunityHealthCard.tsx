import { CommunityHealth } from '@/services/dashboard/dashboard.types';

interface CommunityHealthCardProps {
  health: CommunityHealth;
}

export function CommunityHealthCard({ health }: CommunityHealthCardProps) {
  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="civic-card p-6">
      <h2 className="section-label mb-4">Community Health Overview</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <p className="text-sm text-text-secondary">Health Score</p>
          <p className={`text-3xl font-bold mt-1 ${getHealthColor(health.healthScore)}`}>
            {health.healthScore}/100
          </p>
        </div>
        
        <div>
          <p className="text-sm text-text-secondary">Active Incidents</p>
          <p className="text-3xl font-bold text-text-primary mt-1">{health.activeIncidents}</p>
        </div>
        
        <div>
          <p className="text-sm text-text-secondary">Resolved Today</p>
          <p className="text-3xl font-bold text-text-primary mt-1">{health.resolvedToday}</p>
        </div>
        
        <div>
          <p className="text-sm text-text-secondary">Avg Response</p>
          <p className="text-3xl font-bold text-text-primary mt-1">{health.averageResponseTimeMinutes}m</p>
        </div>
      </div>
    </div>
  );
}
