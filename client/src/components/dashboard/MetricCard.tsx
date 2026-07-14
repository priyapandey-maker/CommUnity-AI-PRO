
interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export function MetricCard({ title, value, subtitle, trend, trendValue }: MetricCardProps) {
  return (
    <div className="civic-card p-5 flex flex-col justify-between">
      <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-text-primary">{value}</span>
        {trend && trendValue && (
          <span className={`text-sm font-medium ${
            trend === 'up' ? 'text-red-600 dark:text-red-400' : 
            trend === 'down' ? 'text-green-600 dark:text-green-400' : 
            'text-text-tertiary'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1 text-sm text-text-tertiary">{subtitle}</p>}
    </div>
  );
}
