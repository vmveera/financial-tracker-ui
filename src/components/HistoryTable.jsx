import { useEffect, useState } from 'react';
import { getAllIncome, deleteIncome } from '../api/income';

export default function HistoryTable({ userId, refresh, onDelete }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingMonth, setDeletingMonth] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getAllIncome(userId)
      .then((res) => setHistory(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId, refresh]);

  const handleDelete = async (month) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete income for ${month}?`
    );
    if (!confirmed) return;

    setDeletingMonth(month);
    try {
      await deleteIncome(userId, month);
      setHistory((prev) => prev.filter((item) => item.month !== month));
      if (onDelete) onDelete();
    } catch (err) {
      alert('Failed to delete. Please try again.');
      console.error(err);
    } finally {
      setDeletingMonth(null);
    }
  };

  if (loading) return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <p className="text-gray-500">Loading history...</p>
    </div>
  );

  if (!history.length) return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <p className="text-gray-500">No income history found for {userId}.</p>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        📅 Monthly History
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Month</th>
              <th className="px-4 py-3">Income (₹)</th>
              <th className="px-4 py-3">Savings 50% (₹)</th>
              <th className="px-4 py-3">Needs 30% (₹)</th>
              <th className="px-4 py-3">Wants 20% (₹)</th>
              {/* ✅ Delete column */}
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {history.map((item) => (
              <tr key={item.month} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-blue-600">
                  👤 {item.userId}
                </td>
                <td className="px-4 py-3 font-medium">{item.month}</td>
                <td className="px-4 py-3">
                  ₹{item.income?.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 text-blue-600">
                  ₹{item.breakdown.savings.amount?.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 text-green-600">
                  ₹{item.breakdown.needs.amount?.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 text-yellow-600">
                  ₹{item.breakdown.wants.amount?.toLocaleString('en-IN')}
                </td>
                {/* ✅ Delete button */}
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(item.month)}
                    disabled={deletingMonth === item.month}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-lg transition disabled:opacity-50"
                  >
                    {deletingMonth === item.month ? 'Deleting...' : '🗑️ Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
