import { useState } from 'react';
import { saveIncome } from '../api/income';

export default function IncomeForm({ onSuccess, userId }) {
  const [income, setIncome]   = useState('');
  const [month, setMonth]     = useState('2026-05');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await saveIncome(userId, income, month);
      onSuccess(result.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        💰 Enter Your Monthly Income
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ✅ Show userId as read-only */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            User ID
          </label>
          <input
            type="text"
            value={userId}
            readOnly
            className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            {/* ✅ INR label */}
            Monthly Income (₹ INR)
          </label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 177644"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Month
          </label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Calculate & Save'}
        </button>
      </form>
    </div>
  );
}
