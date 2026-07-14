import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface HeatmapDataPoint {
  x: number;
  y: number;
  z: number;
  name: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface CommunityHeatmapProps {
  data?: HeatmapDataPoint[];
}

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'CRITICAL': return '#ef4444'; // Red
    case 'HIGH': return '#f97316';     // Orange
    case 'MEDIUM': return '#eab308';   // Yellow
    default: return '#3b82f6';         // Blue
  }
};

export function CommunityHeatmap({ data }: CommunityHeatmapProps) {
  // Generate some deterministic mock distribution if no data is provided
  const chartData = data || [
    { x: 10, y: 30, z: 200, name: 'Downtown', riskLevel: 'CRITICAL' },
    { x: 40, y: 50, z: 100, name: 'North Hills', riskLevel: 'MEDIUM' },
    { x: 70, y: 20, z: 300, name: 'Industrial Park', riskLevel: 'HIGH' },
    { x: 80, y: 80, z: 50, name: 'Suburbs East', riskLevel: 'LOW' },
    { x: 20, y: 70, z: 150, name: 'West End', riskLevel: 'MEDIUM' },
  ];

  return (
    <div className="w-full h-full min-h-[250px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
          <XAxis type="number" dataKey="x" hide domain={[0, 100]} />
          <YAxis type="number" dataKey="y" hide domain={[0, 100]} />
          <ZAxis type="number" dataKey="z" range={[100, 1000]} />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }} 
            contentStyle={{ backgroundColor: 'var(--surface-3)', borderColor: 'var(--line)', borderRadius: '6px', color: 'var(--text-primary)' }}
            formatter={(_value: any, _name: any, props: any) => [props.payload.name, 'Location']}
          />
          <Scatter name="Risk Areas" data={chartData} fill="#8884d8">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getRiskColor(entry.riskLevel)} fillOpacity={0.7} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
