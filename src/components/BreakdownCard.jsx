export default function BreakdownCard({ label, amount, percentage, color, icon }) {
  return (
    <div className={`rounded-2xl shadow-md p-6 text-white ${color}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-lg font-bold">{percentage}</span>
      </div>
      <p className="text-sm opacity-80">{label}</p>
      <p className="text-3xl font-bold mt-1">
        ${amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
}
