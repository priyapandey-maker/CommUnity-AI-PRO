import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { DepartmentSummary } from '../../../services/dashboard/dashboard.types';

interface DepartmentBarChartProps {
  data: DepartmentSummary[];
}

export function DepartmentBarChart({ data }: DepartmentBarChartProps) {
  return (
    <div className="w-full h-full min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="var(--text-tertiary)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="var(--text-tertiary)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <Tooltip 
            cursor={{ fill: 'var(--surface-3)' }}
            contentStyle={{ backgroundColor: 'var(--surface-2)', borderColor: 'var(--line)', borderRadius: '6px', color: 'var(--text-primary)' }}
            itemStyle={{ color: 'var(--text-primary)' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
          <Bar dataKey="openCases" name="Open Cases" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="criticalCases" name="Critical Cases" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
