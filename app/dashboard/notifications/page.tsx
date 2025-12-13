"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";





// ----------------------------
// ICONS FOR NOTIFICATION TYPES
// ----------------------------
function getIcon(type: string) {
  const map: Record<string, string> = {
    vendor_assigned: "🧰",
    hours_logged: "⏱️",
    status_updated: "🔄",
  };

  return map[type] || "🔔";
}

export default function NotificationsPage() {
  const notifications = useQuery(api.notifications.getCompanyNotifications, {});
  const markAsRead = useMutation(api.notifications.markAsRead);

  if (!notifications) {
    return <div className="p-6 text-gray-600">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Title */}
      <h1 className="text-2xl font-bold">Notifications</h1>

      {/* Empty state */}
      {notifications.length === 0 && (
        <p className="text-gray-600">No notifications yet</p>
      )}

      {/* Notification list */}
      <div className="space-y-4">
        {notifications.map((n) => {
          const isUnread = !n.read;

          return (
            <div
              key={n._id}
              onClick={() => markAsRead({ id: n._id })}
              className={`flex gap-4 p-4 rounded-xl border shadow-sm cursor-pointer transition-all 
                hover:shadow-md hover:scale-[1.01]
                ${
                  isUnread
                    ? "bg-blue-50 border-blue-300"
                    : "bg-white border-gray-200"
                }`}
            >
              {/* Icon */}
              <div className="text-3xl">{getIcon(n.type)}</div>

              <div className="flex-1">
                {/* Message */}
                <p className="font-semibold text-gray-900">{n.message}</p>

                {/* Type */}
                <p className="text-sm text-gray-500 capitalize">
                  {n.type.replaceAll("_", " ")}
                </p>

                {/* Timestamp */}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Unread dot */}
              {isUnread && (
                <div className="flex items-center">
                  <span className="h-3 w-3 bg-blue-600 rounded-full animate-pulse"></span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
