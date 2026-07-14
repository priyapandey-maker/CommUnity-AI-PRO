
export function MetricSkeleton() {
  return (
    <div className="civic-card p-5 animate-pulse flex flex-col justify-between">
      <div className="h-4 bg-surface-3 rounded w-1/2 mb-4"></div>
      <div className="h-8 bg-surface-3 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-surface-3 rounded w-1/3"></div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="civic-card overflow-hidden animate-pulse">
      <div className="bg-surface-2 h-10 w-full border-b border-line"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex p-4 border-b border-line gap-4">
          <div className="h-4 bg-surface-3 rounded w-16"></div>
          <div className="h-4 bg-surface-3 rounded w-1/3"></div>
          <div className="h-4 bg-surface-3 rounded w-24 ml-auto"></div>
        </div>
      ))}
    </div>
  );
}

export function TimelineSkeleton() {
  return (
    <div className="civic-card p-6 animate-pulse">
      <div className="h-4 bg-surface-3 rounded w-1/4 mb-6"></div>
      <div className="space-y-6 ml-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="w-3 h-3 bg-surface-3 rounded-full mt-1"></div>
            <div className="flex-1">
              <div className="h-4 bg-surface-3 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-surface-3 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 bg-surface-3 rounded w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <MetricSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TableSkeleton />
        </div>
        <div>
          <div className="civic-card p-4 h-64 bg-surface-3 rounded"></div>
        </div>
      </div>
    </div>
  );
}
