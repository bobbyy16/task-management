import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { fetchNotifications } from "../api";
import NotificationItem from "../components/NotificationItem";

function Notifications() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const notificationsData = await fetchNotifications(token);
        setNotifications(notificationsData);
        setError("");
      } catch (err) {
        setError("Failed to load notifications. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [token]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No notifications yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow divide-y">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
