// "use client";

// import { useQuery, useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { useSessionToken } from "@/hooks/useSessionToken";

// /* ----------------------------
//    ICONS FOR NOTIFICATION TYPES
// ---------------------------- */
// function getIcon(type: string) {
//   const map: Record<string, string> = {
//     vendor_assigned: "🧰",
//     hours_logged: "⏱️",
//     status_updated: "🔄",
//   };

//   return map[type] || "🔔";
// }

// export default function NotificationsPage() {
//   /* --------------------------------------------------
//      AUTH
//   -------------------------------------------------- */
//   const token = useSessionToken();
//   const isReady = !!token;

//   /* --------------------------------------------------
//      QUERIES
//   -------------------------------------------------- */
//   const token = useSessionToken();

// const notificationsQuery = useQuery(
//   api.notifications.getCompanyNotifications,
//   token ? { token } : "skip"
// );

// const markAsRead = useMutation(api.notifications.markAsRead);

// if (!token || !notificationsQuery) {
//   return <div className="p-6 text-gray-600">Loading...</div>;
// }

// const notifications = notificationsQuery;

//   /* --------------------------------------------------
//      UI
//   -------------------------------------------------- */
//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold">Notifications</h1>

//       {notifications.length === 0 && (
//         <p className="text-gray-600">No notifications yet</p>
//       )}

//       <div className="space-y-4">
//         {notifications.map((n) => {
//           const isUnread = !n.read;

//           return (
//             <div
//               key={n._id}
//               onClick={() =>
//                 markAsRead({
//                   token,
//                   id: n._id,
//                 })
//               }
//               className={`flex gap-4 p-4 rounded-xl border shadow-sm cursor-pointer
//                 ${
//                   isUnread
//                     ? "bg-blue-50 border-blue-300"
//                     : "bg-white border-gray-200"
//                 }`}
//             >
//               {/* Icon */}
//               <div className="text-3xl">{getIcon(n.type)}</div>

//               {/* Content */}
//               <div className="flex-1">
//                 <p className="font-semibold text-gray-900">{n.message}</p>
//                 <p className="text-sm text-gray-500 capitalize">
//                   {n.type.replaceAll("_", " ")}
//                 </p>
//                 <p className="text-xs text-gray-400 mt-1">
//                   {new Date(n.createdAt).toLocaleString()}
//                 </p>
//               </div>

//               {/* Unread indicator */}
//               {isUnread && (
//                 <div className="flex items-center">
//                   <span className="h-3 w-3 bg-blue-600 rounded-full"></span>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSessionToken } from "@/hooks/useSessionToken";

function getIcon(type: string) {
  const map: Record<string, string> = {
    vendor_assigned: "🧰",
    hours_logged: "⏱️",
    status_updated: "🔄",
  };

  return map[type] || "🔔";
}

export default function NotificationsPage() {
  const token = useSessionToken();

  const notificationsQuery = useQuery(
    api.notifications.getCompanyNotifications,
    token ? { token } : "skip"
  );

  const markAsRead = useMutation(api.notifications.markAsRead);

  if (!token || !notificationsQuery) {
    return <div className="p-6 text-gray-600">Loading...</div>;
  }

  const notifications = notificationsQuery;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Notifications</h1>

      {notifications.length === 0 && (
        <p className="text-gray-600">No notifications yet</p>
      )}

      <div className="space-y-4">
        {notifications.map((n) => {
          const isUnread = !n.read;

          return (
            <div
              key={n._id}
              onClick={() =>
                markAsRead({
                  token,
                  id: n._id,
                })
              }
              className={`flex gap-4 p-4 rounded-xl border shadow-sm cursor-pointer
                ${
                  isUnread
                    ? "bg-blue-50 border-blue-300"
                    : "bg-white border-gray-200"
                }`}
            >
              <div className="text-3xl">{getIcon(n.type)}</div>

              <div className="flex-1">
                <p className="font-semibold text-gray-900">{n.message}</p>
                <p className="text-sm text-gray-500 capitalize">
                  {n.type.replaceAll("_", " ")}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>

              {isUnread && (
                <div className="flex items-center">
                  <span className="h-3 w-3 bg-blue-600 rounded-full"></span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
