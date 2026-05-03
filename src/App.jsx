import { useState, useEffect } from 'react';
import IncomeForm from './components/IncomeForm';
import BreakdownCard from './components/BreakdownCard';
import BreakdownPieChart from './components/PieChart';
import HistoryTable from './components/HistoryTable';
import { getAllIncome, getUsers } from './api/income';

export default function App() {
  const [breakdown, setBreakdown]   = useState(null);
  const [income, setIncome]         = useState(null);
  const [refresh, setRefresh]       = useState(0);
  const [userId, setUserId]         = useState('');
  const [users, setUsers]           = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // ✅ Load all users from DynamoDB on startup
  useEffect(() => {
    getUsers()
      .then((res) => {
        const userList = res.users || [];
        setUsers(userList);
        if (userList.length > 0) setUserId(userList[0]);
      })
      .catch(console.error)
      .finally(() => setLoadingUsers(false));
  }, []);

  // ✅ Load latest breakdown when user changes
  useEffect(() => {
    if (!userId) return;
    setBreakdown(null);
    setIncome(null);
    getAllIncome(userId)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const latest = res.data[0];
          setBreakdown(latest.breakdown);
          setIncome(latest.income);
        }
      })
      .catch(console.error);
  }, [userId, refresh]);

  const handleSuccess = (data) => {
    setBreakdown(data.breakdown);
    setIncome(data.income);
    setRefresh((r) => r + 1);
  };

  const handleDelete = () => {
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

        {/* ✅ User Selector */}
        <div className="mt-4 flex items-center gap-4">
          <label className="text-sm font-medium text-gray-600">
            👤 Select User:
          </label>
          {loadingUsers ? (
            <p className="text-gray-400 text-sm">Loading users...</p>
          ) : (
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {users.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          )}
          <span className="text-xs text-gray-400">
            {users.length} user{users.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Form + Cards */}
        <div className="space-y-6">
          <IncomeForm onSuccess={handleSuccess} userId={userId} />

          {breakdown && (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm font-medium">
                Latest breakdown for ₹{income?.toLocaleString('en-IN')} income:
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
        <HistoryTable
          userId={userId}
          refresh={refresh}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}