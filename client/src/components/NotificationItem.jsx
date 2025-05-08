import React from "react";

function NotificationItem({ notification }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`p-4 ${notification.isRead ? "bg-white" : "bg-blue-50"}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center ${
              notification.isRead ? "bg-gray-200" : "bg-blue-200"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-sm text-gray-800">{notification.message}</p>
          <p className="mt-1 text-xs text-gray-500">
            {formatDate(notification.createdAt)}
          </p>
        </div>

        {/*  */}
      </div>
    </div>
  );
}

export default NotificationItem;
