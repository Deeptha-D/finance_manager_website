import React, { useEffect, useState } from "react";

const NotificationsPage = ({ apiUrl, token, onBack }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await fetch(`${apiUrl}/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setNotifications(data.notifications || []);
        } else {
          alert(data.message || "Failed to load notifications");
        }
      } catch (error) {
        console.error("Notifications error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, [apiUrl, token]);

  return (
    <div className="relative min-h-screen bg-gradient-pink flex items-center justify-center px-4 overflow-hidden">

     
      
      {/* Glass Card */}
      <div className="relative glass rounded-2xl shadow-2xl p-8 w-full max-w-md text-white z-10">
        <h2 className="text-3xl font-bold mb-6 text-center">
          🔔 Notifications & Alerts
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl mb-4">No notifications</p>
            <p className="opacity-75">Your finances are looking good!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border-l-4 ${
                  notif.level === "success"
                    ? "bg-green-500/10 border-green-400"
                    : notif.level === "warning"
                    ? "bg-yellow-500/10 border-yellow-400"
                    : "bg-red-500/10 border-red-400"
                }`}
              >
                <p className="font-medium">{notif.text}</p>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onBack}
          className="text-pink font-bold hover:text-pink-200 transition-colors mt-6 w-full p-3 rounded-lg bg-white/10 border border-white/20"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotificationsPage;
