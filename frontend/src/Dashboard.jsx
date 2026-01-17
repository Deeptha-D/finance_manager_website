// src/Dashboard.jsx
import React, { useEffect, useState } from "react";

const styles = {
  page: {
    minHeight: "100vh",
    padding: "32px 20px 40px",
    background: "linear-gradient(135deg, #ec4899 0%, #db2777 25%, #be185d 50%, #9f1239 75%, #881337 100%)",
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: "#111827",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  header: {
    textAlign: "left",
    color: "#f9fafb",
  },
  headerTitle: {
    fontSize: "2rem",
    fontWeight: 700,
    marginBottom: 4,
  },
  headerText: {
    fontSize: "0.95rem",
    opacity: 0.9,
  },
  summary: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "14px 16px",
    boxShadow: "0 4px 14px rgba(15, 23, 42, 0.12)",
    textAlign: "center",
  },
  summaryLabel: {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#111827",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: "1.3rem",
    fontWeight: 700,
    color: "#111827",
    marginBottom: 4,
  },
  statusOk: {
    color: "#16a34a",
  },
  statusLow: {
    color: "#f97316",
  },
  statusCritical: {
    color: "#dc2626",
  },
  summarySub: {
    fontSize: "0.8rem",
    color: "#4b5563",
  },
  actions: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "18px",
  },
  actionCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "18px 16px",
    boxShadow: "0 4px 14px rgba(15, 23, 42, 0.12)",
    textAlign: "left",
    cursor: "pointer",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
  },
  actionTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    marginBottom: 6,
    color: "#111827",
  },
  actionText: {
    fontSize: "0.9rem",
    color: "#374151",
  },
  bottom: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "18px",
  },
  coming: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "16px 16px",
    boxShadow: "0 4px 14px rgba(15, 23, 42, 0.12)",
    textAlign: "left",
    cursor: "pointer",
  },
  comingTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    marginBottom: 4,
    color: "#111827",
  },
  comingText: {
    fontSize: "0.9rem",
    color: "#4b5563",
  },
  footer: {
    marginTop: "auto",
    paddingTop: "20px",
    display: "flex",
    justifyContent: "center",
  },
  backTab: {
    width: "100%",
    maxWidth: "480px",
    padding: "14px 26px",
    borderRadius: "999px",
    border: "none",
    backgroundColor: "#ffffff",
    color: "#111827",
    fontWeight: 600,
    fontSize: "1rem",
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.25)",
  },
};

const Dashboard = ({ user, token, apiUrl, onLogout, onGoHome, onNavigate }) => {
  const [summary, setSummary] = useState({
    totalExpense: 0,
    remainingBalance: 0,
    status: "Loading",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleBackHome = () => {
    if (onLogout) onLogout();
    if (onGoHome) onGoHome();
  };

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiUrl}/dashboard/summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to load summary");
        }
        setSummary({
          totalExpense: data.totalExpense || 0,
          remainingBalance: data.remainingBalance || 0,
          status: data.status || "Unknown",
        });
        setError("");
      } catch (err) {
        console.error("Summary fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSummary();
    }
  }, [token, apiUrl]);

  const getStatusStyle = () => {
    if (summary.status === "Critical") return styles.statusCritical;
    if (summary.status === "Low") return styles.statusLow;
    return styles.statusOk;
  };

  const loadingText = loading
    ? "Loading from DB…"
    : error
    ? error
    : "Up to date";

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>
          Welcome back, {user?.name || "User"}!
        </h1>
        <p style={styles.headerText}>
          Get a quick overview of your expenses, balance, and status.
        </p>
      </header>

      <section style={styles.summary}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Total Expense</div>
          <div style={styles.summaryValue}>
            ₹{summary.totalExpense.toLocaleString("en-IN")}
          </div>
          <div style={styles.summarySub}>{loadingText}</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Remaining Balance</div>
          <div style={styles.summaryValue}>
            ₹{summary.remainingBalance.toLocaleString("en-IN")}
          </div>
          <div style={styles.summarySub}>{loadingText}</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Status</div>
          <div style={{ ...styles.summaryValue, ...getStatusStyle() }}>
            {summary.status}
          </div>
          <div style={styles.summarySub}>{loadingText}</div>
        </div>
      </section>

      <section style={styles.actions}>
        <div
          style={styles.actionCard}
          onClick={() => onNavigate && onNavigate("analytics")}
        >
          <h3 style={styles.actionTitle}>View Analytics</h3>
          <p style={styles.actionText}>
            Track your spending patterns and identify trends.
          </p>
        </div>
        <div
          style={styles.actionCard}
          onClick={() => onNavigate && onNavigate("update-expenses")}
        >
          <h3 style={styles.actionTitle}>Update Expenses</h3>
          <p style={styles.actionText}>
            Add or edit income and expense transactions.
          </p>
        </div>
        <div
          style={styles.actionCard}
          onClick={() => onNavigate && onNavigate("expense-sheet")}
        >
          <h3 style={styles.actionTitle}>View Expense Sheet</h3>
          <p style={styles.actionText}>
            Check a complete list of your transactions.
          </p>
        </div>
        <div
          style={styles.actionCard}
          onClick={() => onNavigate && onNavigate("notifications")}
        >
          <h3 style={styles.actionTitle}>Notifications &amp; Alerts</h3>
          <p style={styles.actionText}>
            Stay updated on important financial changes.
          </p>
        </div>
      </section>

      <section style={styles.bottom}>
        <div
          style={styles.coming}
          onClick={() => onNavigate && onNavigate("reports")}
        >
          <h3 style={styles.comingTitle}>Reports</h3>
          <p style={styles.comingText}>View detailed reports.</p>
        </div>
        <div
          style={styles.coming}
          onClick={() => onNavigate && onNavigate("settings")}
        >
          <h3 style={styles.comingTitle}>Settings</h3>
          <p style={styles.comingText}>Customize your preferences.</p>
        </div>
      </section>

      <div style={styles.footer}>
        <button style={styles.backTab} onClick={handleBackHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
