import { DepartmentSummary } from '@/services/dashboard/dashboard.types';

interface DepartmentCardProps {
  department: DepartmentSummary;
}

export function DepartmentCard({ department }: DepartmentCardProps) {
  const getWorkloadColor = (workload: string) => {
    switch (workload) {
      case 'CRITICAL': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'HIGH': return 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30';
      case 'LOW': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
      default: return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
    }
  };

  return (
    <div className="civic-card p-5">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-base font-semibold text-text-primary">{department.name}</h3>
        <span className={`text-xs font-semibold px-2 py-1 rounded-md ${getWorkloadColor(department.workload)}`}>
          {department.workload}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <span className="block text-xs text-text-tertiary">Open Cases</span>
          <span className="text-xl font-semibold text-text-primary">{department.openCases}</span>
        </div>
        <div>
          <span className="block text-xs text-text-tertiary">Critical</span>
          <span className={`text-xl font-semibold ${department.criticalCases > 0 ? 'text-red-600 dark:text-red-400' : 'text-text-primary'}`}>
            {department.criticalCases}
          </span>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between text-xs text-text-secondary mb-1">
          <span>Availability</span>
          <span>{department.availabilityPercentage}%</span>
        </div>
        <div className="w-full bg-surface-3 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full ${department.availabilityPercentage < 30 ? 'bg-red-500' : department.availabilityPercentage < 60 ? 'bg-amber-500' : 'bg-green-500'}`} 
            style={{ width: `${department.availabilityPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
