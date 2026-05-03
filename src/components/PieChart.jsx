import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

export default function BreakdownPieChart({ breakdown }) {
  if (!breakdown) return null;

  const data = [
    { name: 'Savings (50%)',  value: breakdown.savings.amount },
    { name: 'Needs (30%)',    value: breakdown.needs.amount },
    { name: 'Wants (20%)',    value: breakdown.wants.amount },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        📊 Budget Breakdown
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) =>
              `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
            }
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
