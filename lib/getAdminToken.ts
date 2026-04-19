export function getAdminToken(): string | undefined {
  return document.cookie
    .split("; ")
    .find((c) => c.startsWith("company_admin_token="))
    ?.split("=")[1];
}
