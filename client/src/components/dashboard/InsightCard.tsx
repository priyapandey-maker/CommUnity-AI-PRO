
interface InsightCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function InsightCard({ title, description, children }: InsightCardProps) {
  return (
    <div className="civic-card p-5 flex flex-col h-full">
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      {description && <p className="text-sm text-text-tertiary mt-1 mb-4">{description}</p>}
      {!description && <div className="mb-4"></div>}
      <div className="flex-1 flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
}
