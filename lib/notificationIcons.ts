export const NOTIFICATION_ICONS: Record<string, string> = {
  vendor_assigned: "🧰",
  hours_logged: "⏱️",
  status_updated: "🔄",
  maintenance_scheduled: "📅",
  maintenance_submitted: "🔧",
  tenant_created: "👤",
  vendor_added: "🏭",
  tenant_moved_out: "🚪",
};

export function getNotificationIcon(type: string): string {
  return NOTIFICATION_ICONS[type] ?? "🔔";
}
