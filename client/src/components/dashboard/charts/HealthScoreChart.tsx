import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer
} from 'recharts';

interface HealthScoreChartProps {
  score: number;
}

const getHealthColor = (score: number) => {
  if (score >= 80) return '#10b981'; // emerald-500
  if (score >= 60) return '#f59e0b'; // amber-500
  return '#ef4444'; // red-500
};

export function HealthScoreChart({ score }: HealthScoreChartProps) {
  const data = [{ name: 'Health', value: score, fill: getHealthColor(score) }];

  return (
    <div className="w-full h-full min-h-[160px] relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          cx="50%" 
          cy="50%" 
          innerRadius="70%" 
          outerRadius="100%" 
          barSize={15} 
          data={data} 
          startAngle={180} 
          endAngle={0}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            background={{ fill: 'var(--surface-3)' }}
            dataKey="value"
            cornerRadius={10}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-2">
        <span className="text-3xl font-bold" style={{ color: getHealthColor(score) }}>
          {score}
        </span>
        <span className="text-sm text-text-tertiary ml-1">/100</span>
      </div>
    </div>
  );
}
