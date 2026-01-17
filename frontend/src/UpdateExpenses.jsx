import React, { useState } from "react";

const UpdateExpenses = ({ apiUrl, token, onBack }) => {
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "Food",
    description: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/expenses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Expense saved successfully!");
        setForm((f) => ({ ...f, amount: "", description: "" }));
      } else {
        setMessage(`❌ ${data.message || "Failed to save"}`);
      }
    } catch (error) {
      setMessage("❌ Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-pink flex items-center justify-center px-4">
      <div className="glass rounded-2xl shadow-2xl p-8 w-full max-w-md text-white">
        <h2 className="text-3xl font-bold mb-4 text-center">Update Expenses</h2>
        
        {message && (
          <div className={`message-${message.startsWith("✅") ? "success" : "error"} mb-4 p-3 rounded-lg`}>
            {message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 font-medium">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
            >
              <option value="income">💰 Income</option>
              <option value="expense">💸 Expense</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
            >
              <option>🍕 Food</option>
              <option>🏠 Rent</option>
              <option>🚗 Transport</option>
              <option>🛍️ Shopping</option>
              <option>💡 Bills</option>
              <option>💼 Salary</option>
              <option>💳 Other</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Description</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
              placeholder="What did you buy?"
            />
          </div>
          <div>                                        

            <button 
            type="submit" 
            disabled={loading} 
            className=" flex justify-center mt-6 primary-btn w-full"
          >
            {loading ? "Saving..." : "Save Expense"}
          </button></div>
        </form>

        <button
          onClick={onBack}
          className="text-pink font-bold hover:text-pink-200 transition-colors mt-4 w-full p-3 rounded-lg bg-white/10 border border-white/20 flex justify-center mt-6"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default UpdateExpenses;
