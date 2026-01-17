import React, { useEffect, useState } from "react";

const Analytics = ({ apiUrl, token, onBack }) => {
  const [catData, setCatData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const res = await fetch(`${apiUrl}/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setCatData(data.byCategory || []);
          setMonthData(data.byMonth || []);
        }
      } catch (error) {
        console.error("Analytics error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, [apiUrl, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-pink flex items-center justify-center px-4">
        <div className="glass rounded-2xl shadow-2xl p-8 w-full max-w-md text-white">
          <h2 className="text-3xl font-bold mb-4 text-center">Analytics</h2>
          <p className="text-center">Loading charts...</p>
          
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-pink flex flex-col items-center px-4 py-8">
     
      <div className="glass rounded-2xl shadow-2xl p-8 w-full max-w-6xl text-white">
        <h2 className="text-3xl font-bold mb-8 text-center">Analytics Dashboard</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Category Pie Chart (mock data for now) */}
          <div className="bg-white/5 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4">Expenses by Category</h3>
            <div className="w-full h-64 bg-white/10 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold">₹{catData.reduce((sum, c) => sum + (c.total || 0), 0)}</span>
                </div>
                <p className="text-sm opacity-75">{catData.length} categories</p>
              </div>
            </div>
            <div className="mt-4 space-y-1">
              {catData.map((cat, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{cat.category}</span>
                  <span>₹{cat.total}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="bg-white/5 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4">Monthly Trends</h3>
            <div className="w-full h-64 bg-white/10 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold">₹{monthData.reduce((sum, m) => sum + (m.total || 0), 0)}</span>
                </div>
                <p className="text-sm opacity-75">{monthData.length} months</p>
              </div>
            </div>
            <div className="mt-4 space-y-1">
              {monthData.slice(-5).reverse().map((month, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{month.month}</span>
                  <span>₹{month.total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <button className="flex justify-center mt-6 primary-btn max-w-md mb-4" onClick={onBack}>
        ← Back to Dashboard
      </button>
    </div>
  );
};

export default Analytics;
