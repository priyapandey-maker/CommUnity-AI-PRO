import { PriorityIncident } from '@/services/dashboard/dashboard.types';
import { IncidentTableRow } from './IncidentTableRow';

interface IncidentTableProps {
  incidents: PriorityIncident[];
  onActionComplete?: () => Promise<void>;
  showToast?: (message: string, type: 'success' | 'error') => void;
}

export function IncidentTable({ incidents, onActionComplete, showToast }: IncidentTableProps) {
  if (incidents.length === 0) {
    return (
      <div className="p-8 text-center text-text-tertiary border border-line rounded-lg bg-surface-1">
        No active incidents.
      </div>
    );
  }

  return (
    <div className="civic-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-line text-left">
          <thead className="bg-surface-2">
            <tr>
              <th scope="col" className="px-4 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">ID</th>
              <th scope="col" className="px-4 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Incident</th>
              <th scope="col" className="px-4 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Category</th>
              <th scope="col" className="px-4 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Priority</th>
              <th scope="col" className="px-4 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Department</th>
              <th scope="col" className="px-4 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Status</th>
              <th scope="col" className="px-4 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Updated</th>
              <th scope="col" className="px-4 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-surface-1 divide-y divide-line">
            {incidents.map((incident) => (
              <IncidentTableRow 
                key={incident.id} 
                incident={incident} 
                onActionComplete={onActionComplete}
                showToast={showToast}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
