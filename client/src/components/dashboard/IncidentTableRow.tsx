import { PriorityIncident } from '@/services/dashboard/dashboard.types';
import { StatusBadge } from './StatusBadge';

interface IncidentTableRowProps {
  incident: PriorityIncident;
}

export function IncidentTableRow({ incident }: IncidentTableRowProps) {
  return (
    <tr className="border-b border-line hover:bg-surface-2/50 transition-colors">
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-sm font-medium text-text-primary">{incident.id}</span>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm text-text-primary line-clamp-1">{incident.title}</div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-sm text-text-secondary">{incident.category}</span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={`text-sm font-semibold ${incident.priority === 'CRITICAL' ? 'text-red-600 dark:text-red-400' : incident.priority === 'HIGH' ? 'text-amber-600 dark:text-amber-400' : 'text-text-secondary'}`}>
          {incident.priority}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-sm text-text-secondary">{incident.department}</span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <StatusBadge status={incident.status} />
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-text-tertiary">
        {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
          View
        </button>
      </td>
    </tr>
  );
}
