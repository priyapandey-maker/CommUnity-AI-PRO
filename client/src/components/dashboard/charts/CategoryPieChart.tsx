import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface CategoryPieChartProps {
  data: { category: string; percentage: number }[];
}

const COLORS = ['#6366f1', '#3b82f6', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6'];

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  return (
    <div className="w-full h-full min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="percentage"
            nameKey="category"
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--surface-3)', borderColor: 'var(--line)', borderRadius: '6px', color: 'var(--text-primary)' }}
            itemStyle={{ color: 'var(--text-primary)' }}
            formatter={(value: any) => [`${value}%`, 'Percentage']}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
