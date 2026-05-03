import { useState, useEffect } from 'react';
import IncomeForm from './components/IncomeForm';
import BreakdownCard from './components/BreakdownCard';
import BreakdownPieChart from './components/PieChart';
import HistoryTable from './components/HistoryTable';
import { getAllIncome } from './api/income';

const DEFAULT_USER = 'veerav';

export default function App() {
  const [breakdown, setBreakdown] = useState(null);
  const [income, setIncome]       = useState(null);
  const [refresh, setRefresh]     = useState(0);
  const [userId]                  = useState(DEFAULT_USER);

  // ✅ Load existing data on app start
  useEffect(() => {
    getAllIncome(userId)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          // Show the latest month's breakdown on load
          const latest = res.data[0];
          setBreakdown(latest.breakdown);
          setIncome(latest.income);
        }
      })
      .catch(console.error);
  }, [userId]);

  const handleSuccess = (data) => {
    setBreakdown(data.breakdown);
    setIncome(data.income);
    setRefresh((r) => r + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          💼 Financial Tracker
        </h1>
        <p className="text-gray-500 mt-1">
          50/30/20 Budget Rule — Smart money management
        </p>
        <p className="text-sm text-blue-600 font-medium mt-1">
          👤 User: {userId}
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Form + Cards */}
        <div className="space-y-6">
          <IncomeForm onSuccess={handleSuccess} userId={userId} />

          {breakdown && (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm font-medium">
                Breakdown for ₹{income?.toLocaleString('en-IN')} income:
              </p>
              <BreakdownCard
                label="Savings"
                amount={breakdown.savings.amount}
                percentage="50%"
                color="bg-blue-500"
                icon="🏦"
              />
              <BreakdownCard
                label="Needs (Bills, Rent, Food)"
                amount={breakdown.needs.amount}
                percentage="30%"
                color="bg-green-500"
                icon="🏠"
              />
              <BreakdownCard
                label="Wants (Entertainment, Shopping)"
                amount={breakdown.wants.amount}
                percentage="20%"
                color="bg-yellow-500"
                icon="🎉"
              />
            </div>
          )}
        </div>

        {/* Right: Chart */}
        <div className="space-y-6">
          {breakdown && <BreakdownPieChart breakdown={breakdown} />}
        </div>
      </div>

      {/* History Table */}
      <div className="max-w-5xl mx-auto mt-6">
        <HistoryTable userId={userId} refresh={refresh} />
      </div>
    </div>
  );
}