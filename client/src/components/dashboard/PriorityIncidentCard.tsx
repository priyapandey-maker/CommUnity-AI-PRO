import { PriorityIncident } from '@/services/dashboard/dashboard.types';
import { StatusBadge } from './StatusBadge';

interface PriorityIncidentCardProps {
  incident: PriorityIncident;
}

export function PriorityIncidentCard({ incident }: PriorityIncidentCardProps) {
  const isCritical = incident.priority === 'CRITICAL';
  
  return (
    <div className={`civic-card p-4 border-l-4 ${isCritical ? 'border-l-red-500' : 'border-l-amber-500'}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-mono text-text-tertiary">{incident.id}</span>
        <span className="text-xs text-text-tertiary">
          {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      
      <h3 className="text-sm font-semibold text-text-primary mb-3 line-clamp-2">
        {incident.title}
      </h3>
      
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold ${isCritical ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
            {incident.priority}
          </span>
          <span className="text-text-tertiary text-xs">•</span>
          <span className="text-xs text-text-secondary">{incident.department}</span>
        </div>
        <StatusBadge status={incident.status} />
      </div>
    </div>
  );
}
