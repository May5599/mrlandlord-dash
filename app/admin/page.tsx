

// "use client";

// import { useEffect, useState } from "react";
// import { fetchMutation, fetchQuery } from "convex/nextjs";
// import { api } from "@/convex/_generated/api";
// import { useRouter } from "next/navigation";

// export default function AdminDashboardPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [companies, setCompanies] = useState<any[]>([]);

//   useEffect(() => {
//     async function init() {
//       const token = document.cookie
//         .split("; ")
//         .find(c => c.startsWith("super_admin_token="))
//         ?.split("=")[1];

//       if (!token) {
//         router.push("/admin/login");
//         return;
//       }

//       const verifyRes = await fetchMutation(
//         api.superAdmins.verify,
//         { token }
//       );

//       if (!verifyRes.allowed) {
//         router.push("/admin/login");
//         return;
//       }

//       const companiesRes = await fetchQuery(
//         api.superAdmins.getAllCompanies,
//         { token }
//       );

//       setCompanies(companiesRes);
//       setLoading(false);
//     }

//     init();
//   }, []);

//   function logout() {
//     document.cookie =
//       "super_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
//     router.push("/admin/login");
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold">Super Admin Dashboard</h1>
//         <button
//           onClick={logout}
//           className="text-sm bg-red-600 text-white px-4 py-2 rounded"
//         >
//           Logout
//         </button>
//       </div>

//       <div className="bg-white rounded shadow p-4">
//         <h2 className="text-lg font-medium mb-3">Companies</h2>

//         {companies.length === 0 && (
//           <p className="text-gray-500">No companies yet</p>
//         )}

//         <ul className="space-y-2">
//           {companies.map(company => (
//             <li
//               key={company._id}
//               className="border rounded p-3 flex justify-between"
//             >
//               <div>
//                 <p className="font-medium">{company.name}</p>
//                 <p className="text-sm text-gray-500">
//                   Manager: {company.managerName}
//                 </p>
//               </div>
//               <p className="text-sm text-gray-400">
//                 {company.managerEmail}
//               </p>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);

  // form state
  const [companyName, setCompanyName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function init() {
      const cookieToken = document.cookie
        .split("; ")
        .find(c => c.startsWith("super_admin_token="))
        ?.split("=")[1];

      if (!cookieToken) {
        router.push("/admin/login");
        return;
      }

      const verifyRes = await fetchMutation(
        api.superAdmins.verify,
        { token: cookieToken }
      );

      if (!verifyRes.allowed) {
        router.push("/admin/login");
        return;
      }

      setToken(cookieToken);

      const companiesRes = await fetchQuery(
        api.superAdmins.getAllCompanies,
        { token: cookieToken }
      );

      setCompanies(companiesRes);
      setLoading(false);
    }

    init();
  }, []);

  async function createCompany() {
    if (!token) return;

    setError("");
    setCreating(true);

    try {
      await fetchMutation(api.superAdmins.createCompanyWithAdmin, {
        superAdminToken: token,
        companyName,
        adminName,
        adminEmail,
        passwordHash: adminPassword,
      });

      // reset form
      setCompanyName("");
      setAdminName("");
      setAdminEmail("");
      setAdminPassword("");

      // refresh list
      const updated = await fetchQuery(
        api.superAdmins.getAllCompanies,
        { token }
      );

      setCompanies(updated);
    } catch (err) {
      setError("Failed to create company");
    } finally {
      setCreating(false);
    }
  }

  function logout() {
    document.cookie =
      "super_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push("/admin/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Super Admin Dashboard</h1>
        <button
          onClick={logout}
          className="text-sm bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Create Company */}
      <div className="bg-white rounded shadow p-4 mb-8">
        <h2 className="text-lg font-medium mb-4">Create Company</h2>

        {error && (
          <p className="text-red-600 text-sm mb-3">{error}</p>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            className="border p-2 rounded"
            placeholder="Company Name"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Admin Name"
            value={adminName}
            onChange={e => setAdminName(e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Admin Email"
            value={adminEmail}
            onChange={e => setAdminEmail(e.target.value)}
          />

          <input
            type="password"
            className="border p-2 rounded"
            placeholder="Admin Password"
            value={adminPassword}
            onChange={e => setAdminPassword(e.target.value)}
          />
        </div>

        <button
          onClick={createCompany}
          disabled={creating}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          {creating ? "Creating..." : "Create Company"}
        </button>
      </div>

      {/* Company List */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-medium mb-3">Companies</h2>

        {companies.length === 0 && (
          <p className="text-gray-500">No companies yet</p>
        )}

        <ul className="space-y-2">
          {companies.map(company => (
            <li
              key={company._id}
              className="border rounded p-3 flex justify-between"
            >
              <div>
                <p className="font-medium">{company.name}</p>
                <p className="text-sm text-gray-500">
                  Manager: {company.managerName}
                </p>
              </div>
              <p className="text-sm text-gray-400">
                {company.managerEmail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
