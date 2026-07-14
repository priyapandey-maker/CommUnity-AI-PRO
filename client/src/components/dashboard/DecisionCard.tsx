import { DecisionSummary } from '@/services/dashboard/dashboard.types';
import { StatusBadge } from './StatusBadge';
import { ConfidenceBadge } from './ConfidenceBadge';
import { EvidencePanel } from './EvidencePanel';

interface DecisionCardProps {
  decision: DecisionSummary;
}

export function DecisionCard({ decision }: DecisionCardProps) {
  return (
    <div className="civic-card p-6 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-text-tertiary">{decision.incidentId}</span>
            <StatusBadge status={decision.status} />
          </div>
          <h3 className="text-lg font-semibold text-text-primary">{decision.incidentTitle}</h3>
        </div>
        <div className="text-right">
          <span className="block text-xs text-text-tertiary mb-1">
            {new Date(decision.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <ConfidenceBadge score={decision.confidence} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">Recommended Action</h4>
            <p className="text-sm text-text-primary font-medium bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-100 dark:border-blue-800/50">
              {decision.recommendedAction}
            </p>
          </div>
          <div className="flex gap-6">
            <div>
              <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">Priority</h4>
              <span className={`font-semibold text-sm ${decision.priority === 'CRITICAL' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {decision.priority}
              </span>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">Responsible Dept</h4>
              <span className="text-sm text-text-primary">{decision.responsibleDepartment}</span>
            </div>
          </div>
        </div>
        
        <div>
          <EvidencePanel 
            reasonSummary={decision.reasonSummary}
            weightings={decision.evidenceWeightings}
          />
        </div>
      </div>
      
      <div className="mt-2 pt-4 border-t border-line flex justify-end gap-3">
        <button className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-2 rounded-md transition-colors">
          Reject
        </button>
        <button className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm">
          Approve Decision
        </button>
      </div>
    </div>
  );
}
