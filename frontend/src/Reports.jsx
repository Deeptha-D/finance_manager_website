import React, { useEffect, useState } from "react";

const Reports = ({ apiUrl, token, onBack }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const res = await fetch(`${apiUrl}/reports/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setReports(data);
        } else {
          console.error("Reports error:", data.message);
        }
      } catch (error) {
        console.error("Reports fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, [apiUrl, token]);

  const getTotal = () => reports.reduce((sum, r) => sum + r.total, 0);

  return (
    <div className="min-h-screen bg-gradient-pink px-4 py-8">
      <div className="max-w-4xl mx-auto">

        {/* Sheet / Glass Card */}
        <div className="glass rounded-2xl shadow-2xl p-6 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">
            📊 Financial Reports
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl">Loading reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl mb-4">No report data yet</p>
              <p className="opacity-75">
                Add some transactions to see monthly summaries
              </p>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid md:grid-cols-3 gap-4 mb-10">
                <div className="bg-white/5 p-4 rounded-xl text-center">
                  <h3 className="text-2xl font-bold">
                    ₹{getTotal().toLocaleString()}
                  </h3>
                  <p className="opacity-75">Total Transactions</p>
                </div>

                <div className="bg-white/5 p-4 rounded-xl text-center">
                  <h3 className="text-2xl font-bold">{reports.length}</h3>
                  <p className="opacity-75">Months</p>
                </div>

                <div className="bg-white/5 p-4 rounded-xl text-center">
                  <h3 className="text-2xl font-bold">{reports.length}</h3>
                  <p className="opacity-75">Transactions</p>
                </div>
              </div>

              {/* Table Section (added top space + border) */}
              <div className="mt-8 border border-white/20 rounded-xl overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-white/10 border-b border-white/20">
                      <th className="p-4 text-left font-bold border-r border-white/20">
                        Month
                      </th>
                      <th className="p-4 text-left font-bold border-r border-white/20">
                        Type
                      </th>
                      <th className="p-4 text-right font-bold">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.slice(0, 12).map((r, i) => (
                      <tr
                        key={i}
                        className="border-b border-white/10 hover:bg-white/10"
                      >
                        <td className="p-4 border-r border-white/10">
                          {r._id?.month || "Unknown"}
                        </td>
                        <td className="p-4 border-r border-white/10">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold ${
                              r._id?.type === "income"
                                ? "bg-green-500/20 text-green-300"
                                : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {r._id?.type}
                          </span>
                        </td>
                        <td className="p-4 text-right font-bold">
                          ₹{r.total.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Back to Dashboard button OUTSIDE sheet */}
        <div className="flex justify-center mt-6">
          <button
            className="primary-btn max-w-md"
            onClick={onBack}
          >
            ← Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};

export default Reports;
