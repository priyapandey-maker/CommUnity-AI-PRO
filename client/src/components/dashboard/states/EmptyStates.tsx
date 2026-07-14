
interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-surface-1 border border-line rounded-lg">
      {icon ? (
        <div className="mb-3 text-text-tertiary">{icon}</div>
      ) : (
        <svg className="w-10 h-10 mb-3 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      <p className="mt-1 text-sm text-text-secondary max-w-sm">{description}</p>
    </div>
  );
}

export function NoCriticalIncidents() {
  return (
    <EmptyState 
      title="No Critical Incidents" 
      description="There are currently no high-priority or critical incidents requiring immediate attention."
      icon={<svg className="w-10 h-10 text-green-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
    />
  );
}

export function NoTimeline() {
  return <EmptyState title="No Activity" description="No recent decisions or escalations have been recorded in the timeline." />;
}

export function NoAnalytics() {
  return <EmptyState title="Insufficient Data" description="Not enough data points collected to generate meaningful community analytics." />;
}

export function NoRecommendations() {
  return <EmptyState title="No Pending Actions" description="The AI engine has not flagged any incidents requiring new operational recommendations." />;
}
