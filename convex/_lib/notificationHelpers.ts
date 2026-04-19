import { DatabaseWriter } from "../_generated/server";
import { Id } from "../_generated/dataModel";

interface NotificationInsert {
  companyId: Id<"companies">;
  type: string;
  message: string;
  maintenanceId?: Id<"maintenance">;
  vendorId?: Id<"vendors">;
  tenantId?: Id<"tenants">;
  status?: string;
}

export async function insertNotification(
  db: DatabaseWriter,
  data: NotificationInsert
): Promise<void> {
  await db.insert("notifications", {
    ...data,
    read: false,
    createdAt: new Date().toISOString(),
  });
}
