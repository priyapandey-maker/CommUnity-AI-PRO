import { useState } from 'react';
import { PriorityIncident } from '@/services/dashboard/dashboard.types';
import { dashboardService } from '@/services/dashboard/dashboard.service';

interface IncidentTableRowProps {
  incident: PriorityIncident;
  onActionComplete?: () => void;
  showToast?: (message: string, type: 'success' | 'error') => void;
}

export function IncidentTableRow({ incident, onActionComplete, showToast }: IncidentTableRowProps) {
  const [loading, setLoading] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [status, setStatus] = useState(incident.status);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus as PriorityIncident['status']); // optimistic update
    setLoading(true);
    try {
      await dashboardService.updateIncidentStatus(incident.id, newStatus);
      if (showToast) showToast('Status updated successfully!', 'success');
      if (onActionComplete) onActionComplete();
    } catch (err) {
      if (showToast) showToast('Failed to update status', 'error');
      setStatus(incident.status); // revert
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (department: string) => {
    setLoading(true);
    setShowAssignModal(false);
    try {
      await dashboardService.updateIncidentStatus(incident.id, status, department);
      if (showToast) showToast(`Assigned to ${department}`, 'success');
      if (onActionComplete) onActionComplete();
    } catch (err) {
      if (showToast) showToast('Failed to assign', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr className="border-b border-line hover:bg-surface-2/50 transition-colors relative">
      <td className="px-4 py-3 whitespace-nowrap">
        {loading && <div className="absolute inset-0 bg-surface-1/50 z-10 animate-pulse" />}
        <span className="text-sm font-medium text-text-primary relative z-20">{incident.id}</span>
      </td>
      <td className="px-4 py-3 relative z-20">
        <div className="text-sm text-text-primary line-clamp-1">{incident.title}</div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap relative z-20">
        <span className="text-sm text-text-secondary">{incident.category}</span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap relative z-20">
        <span className={`text-sm font-semibold ${incident.priority === 'CRITICAL' ? 'text-red-600 dark:text-red-400' : incident.priority === 'HIGH' ? 'text-amber-600 dark:text-amber-400' : 'text-text-secondary'}`}>
          {incident.priority}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap relative z-20">
        <span className="text-sm text-text-secondary">{incident.department}</span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap relative z-20">
        <select 
          value={status} 
          onChange={handleStatusChange}
          disabled={loading}
          className="text-xs font-semibold px-2 py-1 rounded bg-surface-2 border border-line text-text-primary focus:outline-none focus:ring-1 focus:ring-blue-500"
          aria-label={`Update status for incident ${incident.id}`}
        >
          <option value="PENDING">PENDING</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
          <option value="CLOSED">CLOSED</option>
        </select>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-text-tertiary relative z-20">
        {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium relative z-20">
        <div className="flex justify-end gap-4 items-center">
          <div className="relative">
            <button 
              onClick={() => setShowAssignModal(!showAssignModal)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-50 focus-ring rounded"
              disabled={loading}
              aria-expanded={showAssignModal}
              aria-label={`Assign incident ${incident.id}`}
            >
              Assign
            </button>
            {showAssignModal && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-surface-1 border border-line rounded-lg shadow-xl z-50 p-2 text-left">
                <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2 px-2">Assign to</div>
                <button onClick={() => handleAssign('Police Dept')} className="block w-full text-left px-2 py-1 text-sm text-text-primary hover:bg-surface-2 rounded focus-ring">Police Dept</button>
                <button onClick={() => handleAssign('Fire Dept')} className="block w-full text-left px-2 py-1 text-sm text-text-primary hover:bg-surface-2 rounded focus-ring">Fire Dept</button>
                <button onClick={() => handleAssign('Medical Dept')} className="block w-full text-left px-2 py-1 text-sm text-text-primary hover:bg-surface-2 rounded focus-ring">Medical</button>
                <button onClick={() => handleAssign('Public Works')} className="block w-full text-left px-2 py-1 text-sm text-text-primary hover:bg-surface-2 rounded focus-ring">Public Works</button>
                <hr className="my-1 border-line" />
                <button onClick={() => setShowAssignModal(false)} className="block w-full text-left px-2 py-1 text-sm text-red-500 hover:bg-red-500/10 rounded focus-ring" aria-label="Cancel assignment">Cancel</button>
              </div>
            )}
          </div>
          <button 
            onClick={() => window.location.href = `/decision/${incident.id}`}
            className="text-text-secondary hover:text-text-primary focus-ring rounded"
            aria-label={`View incident ${incident.id}`}
          >
            View
          </button>
        </div>
      </td>
    </tr>
  );
}
