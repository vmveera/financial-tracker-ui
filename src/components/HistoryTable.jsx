import { useEffect, useState } from 'react';
import { getAllIncome } from '../api/income';

export default function HistoryTable({ userId, refresh }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getAllIncome(userId)
      .then((res) => setHistory(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId, refresh]);

  if (loading) return <p className="text-gray-500">Loading history...</p>;
  if (!history.length) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        📅 Monthly History
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Month</th>
              <th className="px-4 py-3">Income</th>
              <th className="px-4 py-3">Savings (50%)</th>
              <th className="px-4 py-3">Needs (30%)</th>
              <th className="px-4 py-3">Wants (20%)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {history.map((item) => (
              <tr key={item.month} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{item.month}</td>
                <td className="px-4 py-3">${item.income?.toLocaleString()}</td>
                <td className="px-4 py-3 text-blue-600">
                  ${item.breakdown.savings.amount?.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-green-600">
                  ${item.breakdown.needs.amount?.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-yellow-600">
                  ${item.breakdown.wants.amount?.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
