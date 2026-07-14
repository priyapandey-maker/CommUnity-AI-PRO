import { TimelineEvent } from '@/services/dashboard/dashboard.types';

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  if (events.length === 0) return null;

  return (
    <div className="civic-card p-6">
      <h3 className="section-label mb-6">Decision Timeline</h3>
      
      <div className="relative border-l-2 border-line ml-3 space-y-8">
        {events.map((event, index) => (
          <div key={event.id} className="relative pl-6">
            {/* Timeline dot */}
            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-surface-1
              ${event.type === 'REPORTED' ? 'bg-gray-400' : 
                event.type === 'AI_ANALYSIS' ? 'bg-blue-500' : 
                event.type === 'DECISION' ? 'bg-amber-500' : 'bg-green-500'
              }`} 
            />
            
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <h4 className="text-sm font-semibold text-text-primary">{event.title}</h4>
                <span className="text-xs text-text-tertiary">
                  {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-sm text-text-secondary">{event.description}</p>
              
              {index === 0 && (
                <div className="mt-2 inline-flex items-center text-xs font-mono text-text-tertiary bg-surface-2 px-2 py-1 rounded">
                  Ref: {event.incidentId}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
