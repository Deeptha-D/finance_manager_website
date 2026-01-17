import React, { useEffect, useState } from "react";

const ExpenseSheet = ({ apiUrl, token, onBack }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiUrl}/expenses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setRows(data);
        } else {
          alert(data.message || "Failed to load expenses");
        }
      } catch (error) {
        console.error("Expenses error:", error);
        alert("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, [apiUrl, token]);

  const downloadCsv = () => {
    window.open(`${apiUrl}/expenses/export`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-pink px-4 py-8">
      <div className="max-w-6xl mx-auto">

        {/* Glass Box */}
        <div className="glass rounded-2xl shadow-2xl p-6 text-white">
          <h2 className="text-3xl font-bold mb-6">Expense Sheet</h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl">Loading your transactions...</p>
            </div>
          ) : rows.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl mb-4">No transactions yet</p>
              <p className="text-lg opacity-75">
                Add your first expense using "Update Expenses"
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white/5 rounded-xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-4 text-left font-bold">Date</th>
                    <th className="p-4 text-left font-bold">Type</th>
                    <th className="p-4 text-left font-bold">Category</th>
                    <th className="p-4 text-left font-bold">Description</th>
                    <th className="p-4 text-left font-bold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr
                      key={r._id}
                      className="border-b border-white/5 hover:bg-white/10"
                    >
                      <td className="p-4">
                        {new Date(r.date).toLocaleDateString("en-IN")}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            r.type === "income"
                              ? "bg-green-500/20 text-green-300"
                              : "bg-red-500/20 text-red-300"
                          }`}
                        >
                          {r.type}
                        </span>
                      </td>
                      <td className="p-4 font-medium">{r.category}</td>
                      <td className="p-4 opacity-75">
                        {r.description || "-"}
                      </td>
                      <td className="p-4 font-bold">
                        ₹{Number(r.amount).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* EXACT SPACE like your screenshot */}
        <div className="h-32" />

        {/* Back Button */}
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

export default ExpenseSheet;
