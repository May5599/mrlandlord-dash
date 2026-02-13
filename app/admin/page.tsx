

// // "use client";

// // import { useEffect, useState } from "react";
// // import { fetchMutation, fetchQuery } from "convex/nextjs";
// // import { api } from "@/convex/_generated/api";
// // import { useRouter } from "next/navigation";

// // export default function AdminDashboardPage() {
// //   const router = useRouter();

// //   const [loading, setLoading] = useState(true);
// //   const [companies, setCompanies] = useState<any[]>([]);
// //   const [token, setToken] = useState<string | null>(null);

// //   // form state
// //   const [companyName, setCompanyName] = useState("");
// //   const [adminName, setAdminName] = useState("");
// //   const [adminEmail, setAdminEmail] = useState("");
// //   const [adminPassword, setAdminPassword] = useState("");
// //   const [creating, setCreating] = useState(false);
// //   const [error, setError] = useState("");

// //   useEffect(() => {
// //     async function init() {
// //       const cookieToken = document.cookie
// //         .split("; ")
// //         .find(c => c.startsWith("super_admin_token="))
// //         ?.split("=")[1];

// //       if (!cookieToken) {
// //         router.push("/admin/login");
// //         return;
// //       }

// //       const verifyRes = await fetchMutation(
// //         api.superAdmins.verify,
// //         { token: cookieToken }
// //       );
// // x
// //       if (!verifyRes.allowed) {
// //         router.push("/admin/login");
// //         return;
// //       }

// //       setToken(cookieToken);

// //       const companiesRes = await fetchQuery(
// //         api.superAdmins.getAllCompanies,
// //         { token: cookieToken }
// //       );

// //       setCompanies(companiesRes);
// //       setLoading(false);
// //     }

// //     init();
// //   }, []);

// //   async function createCompany() {
// //     if (!token) return;

// //     setError("");
// //     setCreating(true);

// //     try {
// //       await fetchMutation(api.superAdmins.createCompanyWithAdmin, {
// //         superAdminToken: token,
// //         companyName,
// //         adminName,
// //         adminEmail,
// //         passwordHash: adminPassword,
// //       });

// //       // reset form
// //       setCompanyName("");
// //       setAdminName("");
// //       setAdminEmail("");
// //       setAdminPassword("");

// //       // refresh list
// //       const updated = await fetchQuery(
// //         api.superAdmins.getAllCompanies,
// //         { token }
// //       );

// //       setCompanies(updated);
// //     } catch (err) {
// //       setError("Failed to create company");
// //     } finally {
// //       setCreating(false);
// //     }
// //   }

// //   function logout() {
// //     document.cookie =
// //       "super_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
// //     router.push("/admin/login");
// //   }

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         Loading...
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-6">
// //       <div className="flex justify-between items-center mb-6">
// //         <h1 className="text-2xl font-semibold">Super Admin Dashboard</h1>
// //         <button
// //           onClick={logout}
// //           className="text-sm bg-red-600 text-white px-4 py-2 rounded"
// //         >
// //           Logout
// //         </button>
// //       </div>

// //       {/* Create Company */}
// //       <div className="bg-white rounded shadow p-4 mb-8">
// //         <h2 className="text-lg font-medium mb-4">Create Company</h2>

// //         {error && (
// //           <p className="text-red-600 text-sm mb-3">{error}</p>
// //         )}

// //         <div className="grid grid-cols-2 gap-4 mb-4">
// //           <input
// //             className="border p-2 rounded"
// //             placeholder="Company Name"
// //             value={companyName}
// //             onChange={e => setCompanyName(e.target.value)}
// //           />

// //           <input
// //             className="border p-2 rounded"
// //             placeholder="Admin Name"
// //             value={adminName}
// //             onChange={e => setAdminName(e.target.value)}
// //           />

// //           <input
// //             className="border p-2 rounded"
// //             placeholder="Admin Email"
// //             value={adminEmail}
// //             onChange={e => setAdminEmail(e.target.value)}
// //           />

// //           <input
// //             type="password"
// //             className="border p-2 rounded"
// //             placeholder="Admin Password"
// //             value={adminPassword}
// //             onChange={e => setAdminPassword(e.target.value)}
// //           />
// //         </div>

// //         <button
// //           onClick={createCompany}
// //           disabled={creating}
// //           className="bg-indigo-600 text-white px-4 py-2 rounded"
// //         >
// //           {creating ? "Creating..." : "Create Company"}
// //         </button>
// //       </div>

// //       {/* Company List */}
// //       <div className="bg-white rounded shadow p-4">
// //         <h2 className="text-lg font-medium mb-3">Companies</h2>

// //         {companies.length === 0 && (
// //           <p className="text-gray-500">No companies yet</p>
// //         )}

// //         <ul className="space-y-2">
// //           {companies.map(company => (
// //             <li
// //               key={company._id}
// //               className="border rounded p-3 flex justify-between"
// //             >
// //               <div>
// //                 <p className="font-medium">{company.name}</p>
// //                 <p className="text-sm text-gray-500">
// //                   Manager: {company.managerName}
// //                 </p>
// //               </div>
// //               <p className="text-sm text-gray-400">
// //                 {company.managerEmail}
// //               </p>
// //             </li>
// //           ))}
// //         </ul>
// //       </div>
// //     </div>
// //   );
// // }
// "use client";

// import { useEffect, useState } from "react";
// import { fetchMutation, fetchQuery } from "convex/nextjs";
// import { api } from "@/convex/_generated/api";
// import { useRouter } from "next/navigation";

// type Company = {
//   _id: string;
//   name: string;
//   managerName: string;
//   managerEmail: string;
//   createdAt: string;
// };

// export default function AdminDashboardPage() {
//   const router = useRouter();

//   const [loading, setLoading] = useState<boolean>(true);
//   const [companies, setCompanies] = useState<Company[]>([]);
//   const [token, setToken] = useState<string | null>(null);

//   const [companyName, setCompanyName] = useState<string>("");
//   const [adminName, setAdminName] = useState<string>("");
//   const [adminEmail, setAdminEmail] = useState<string>("");
//   const [creating, setCreating] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");

//   useEffect(() => {
//     async function init(): Promise<void> {
//       const cookieToken = document.cookie
//         .split("; ")
//         .find((c) =>
//           c.startsWith("super_admin_token=")
//         )
//         ?.split("=")[1];

//       if (!cookieToken) {
//         router.push("/admin/login");
//         return;
//       }

//       try {
//         const verifyRes = await fetchMutation(
//           api.superAdmins.verify,
//           { token: cookieToken }
//         );

//         if (
//           !verifyRes.allowed ||
//           (verifyRes.role !== "super_admin" &&
//             verifyRes.role !== "admin")
//         ) {
//           router.push("/admin/login");
//           return;
//         }

//         setToken(cookieToken);

//         const companiesRes =
//           await fetchQuery(
//             api.superAdmins.getAllCompanies,
//             { token: cookieToken }
//           );

//         setCompanies(companiesRes);
//       } catch {
//         router.push("/admin/login");
//       } finally {
//         setLoading(false);
//       }
//     }

//     init();
//   }, [router]);

//   async function createCompany(): Promise<void> {
//     if (!token) return;

//     if (
//       companyName.trim() === "" ||
//       adminName.trim() === "" ||
//       adminEmail.trim() === ""
//     ) {
//       setError("All fields are required");
//       return;
//     }

//     setError("");
//     setCreating(true);

//     try {
//       await fetchMutation(
//         api.superAdmins.createCompanyWithAdmin,
//         {
//           superAdminToken: token,
//           companyName: companyName.trim(),
//           adminName: adminName.trim(),
//           adminEmail: adminEmail.trim(),
//         }
//       );

//       setCompanyName("");
//       setAdminName("");
//       setAdminEmail("");

//       const updated =
//         await fetchQuery(
//           api.superAdmins.getAllCompanies,
//           { token }
//         );

//       setCompanies(updated);
//     } catch {
//       setError("Failed to create company");
//     } finally {
//       setCreating(false);
//     }
//   }

//   function logout(): void {
//     document.cookie =
//       "super_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict;";
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
//         <h1 className="text-2xl font-semibold">
//           Super Admin Dashboard
//         </h1>
//         <button
//           onClick={logout}
//           className="text-sm bg-red-600 text-white px-4 py-2 rounded"
//         >
//           Logout
//         </button>
//       </div>

//       <div className="bg-white rounded shadow p-4 mb-8">
//         <h2 className="text-lg font-medium mb-4">
//           Create Company
//         </h2>

//         {error !== "" && (
//           <p className="text-red-600 text-sm mb-3">
//             {error}
//           </p>
//         )}

//         <div className="grid grid-cols-2 gap-4 mb-4">
//           <input
//             className="border p-2 rounded"
//             placeholder="Company Name"
//             value={companyName}
//             onChange={(e) =>
//               setCompanyName(e.target.value)
//             }
//           />

//           <input
//             className="border p-2 rounded"
//             placeholder="Admin Name"
//             value={adminName}
//             onChange={(e) =>
//               setAdminName(e.target.value)
//             }
//           />

//           <input
//             className="border p-2 rounded"
//             placeholder="Admin Email"
//             value={adminEmail}
//             onChange={(e) =>
//               setAdminEmail(e.target.value)
//             }
//             type="email"
//           />
//         </div>

//         <button
//           onClick={createCompany}
//           disabled={creating}
//           className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
//         >
//           {creating
//             ? "Creating..."
//             : "Create Company"}
//         </button>
//       </div>

//       <div className="bg-white rounded shadow p-4">
//         <h2 className="text-lg font-medium mb-3">
//           Companies
//         </h2>

//         {companies.length === 0 && (
//           <p className="text-gray-500">
//             No companies yet
//           </p>
//         )}

//         <ul className="space-y-2">
//           {companies.map((company) => (
//             <li
//               key={company._id}
//               className="border rounded p-3 flex justify-between"
//             >
//               <div>
//                 <p className="font-medium">
//                   {company.name}
//                 </p>
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
import { Id } from "@/convex/_generated/dataModel";

type Company = {
  _id: Id<"companies">;
  name: string;
  managerName: string;
  managerEmail: string;
  createdAt: string;
};

type SuperAdminUser = {
  _id: Id<"superAdmins">;
  name: string;
  email: string;
  role: "super_admin" | "admin";
  isActive: boolean;
  createdAt: string;
};

export default function AdminDashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [admins, setAdmins] = useState<SuperAdminUser[]>([]);
  const [token, setToken] = useState<string | null>(null);

  const [companyName, setCompanyName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<
    "super_admin" | "admin"
  >("admin");

  useEffect(() => {
    async function init(): Promise<void> {
      const cookieToken = document.cookie
        .split("; ")
        .find((c) =>
          c.startsWith("super_admin_token=")
        )
        ?.split("=")[1];

      if (!cookieToken) {
        router.push("/admin/login");
        return;
      }

      try {
        const verifyRes = await fetchMutation(
          api.superAdmins.verify,
          { token: cookieToken }
        );

        if (
          !verifyRes.allowed ||
          (verifyRes.role !== "super_admin" &&
            verifyRes.role !== "admin")
        ) {
          router.push("/admin/login");
          return;
        }

        setToken(cookieToken);

        const companiesRes =
          await fetchQuery(
            api.superAdmins.getAllCompanies,
            { token: cookieToken }
          );

        setCompanies(companiesRes);

        if (verifyRes.role === "super_admin") {
          const adminsRes =
            await fetchQuery(
              api.superAdmins.getAllSuperAdmins,
              { token: cookieToken }
            );

          setAdmins(adminsRes);
        }
      } catch {
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [router]);

  async function createAdminUser(): Promise<void> {
    if (!token) return;

    if (!newAdminName || !newAdminEmail) return;

    await fetchMutation(
      api.superAdmins.createSuperAdminUser,
      {
        token,
        name: newAdminName,
        email: newAdminEmail,
        role: newAdminRole,
      }
    );

    const updated =
      await fetchQuery(
        api.superAdmins.getAllSuperAdmins,
        { token }
      );

    setAdmins(updated);

    setNewAdminName("");
    setNewAdminEmail("");
    setNewAdminRole("admin");
  }

  async function toggleStatus(
    id: Id<"superAdmins">
  ): Promise<void> {
    if (!token) return;

    await fetchMutation(
      api.superAdmins.toggleSuperAdminStatus,
      { token, adminId: id }
    );

    const updated =
      await fetchQuery(
        api.superAdmins.getAllSuperAdmins,
        { token }
      );

    setAdmins(updated);
  }

  async function updateRole(
    id: Id<"superAdmins">,
    role: "super_admin" | "admin"
  ): Promise<void> {
    if (!token) return;

    await fetchMutation(
      api.superAdmins.updateSuperAdminRole,
      { token, adminId: id, role }
    );

    const updated =
      await fetchQuery(
        api.superAdmins.getAllSuperAdmins,
        { token }
      );

    setAdmins(updated);
  }

  async function deleteAdmin(
    id: Id<"superAdmins">
  ): Promise<void> {
    if (!token) return;

    await fetchMutation(
      api.superAdmins.deleteSuperAdmin,
      { token, adminId: id }
    );

    const updated =
      await fetchQuery(
        api.superAdmins.getAllSuperAdmins,
        { token }
      );

    setAdmins(updated);
  }

  async function createCompany(): Promise<void> {
    if (!token) return;

    if (!companyName || !adminName || !adminEmail)
      return;

    setCreating(true);

    await fetchMutation(
      api.superAdmins.createCompanyWithAdmin,
      {
        superAdminToken: token,
        companyName,
        adminName,
        adminEmail,
      }
    );

    const updated =
      await fetchQuery(
        api.superAdmins.getAllCompanies,
        { token }
      );

    setCompanies(updated);

    setCompanyName("");
    setAdminName("");
    setAdminEmail("");

    setCreating(false);
  }

  function logout(): void {
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
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          Super Admin Dashboard
        </h1>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Manage Admin Users */}
      <div className="bg-white rounded shadow p-6 space-y-4">
        <h2 className="text-lg font-medium">
          Manage Admin Users
        </h2>

        <div className="flex gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Name"
            value={newAdminName}
            onChange={(e) =>
              setNewAdminName(e.target.value)
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="Email"
            value={newAdminEmail}
            onChange={(e) =>
              setNewAdminEmail(e.target.value)
            }
          />
          <select
            className="border p-2 rounded"
            value={newAdminRole}
            onChange={(e) =>
              setNewAdminRole(
                e.target.value as
                  | "super_admin"
                  | "admin"
              )
            }
          >
            <option value="admin">
              Admin
            </option>
            <option value="super_admin">
              Super Admin
            </option>
          </select>
          <button
            onClick={createAdminUser}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Add User
          </button>
        </div>

        <ul className="space-y-2">
          {admins.map((admin) => (
            <li
              key={admin._id}
              className="border p-3 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-medium">
                  {admin.name}
                </p>
                <p className="text-sm text-gray-500">
                  {admin.email}
                </p>
                <p className="text-xs">
                  {admin.role} |{" "}
                  {admin.isActive
                    ? "Active"
                    : "Disabled"}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    toggleStatus(admin._id)
                  }
                  className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                >
                  Toggle
                </button>

                <button
                  onClick={() =>
                    updateRole(
                      admin._id,
                      admin.role ===
                        "admin"
                        ? "super_admin"
                        : "admin"
                    )
                  }
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                >
                  Switch Role
                </button>

                <button
                  onClick={() =>
                    deleteAdmin(admin._id)
                  }
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Company Section */}
      <div className="bg-white rounded shadow p-6 space-y-4">
        <h2 className="text-lg font-medium">
          Create Company
        </h2>

        <div className="flex gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) =>
              setCompanyName(e.target.value)
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="Admin Name"
            value={adminName}
            onChange={(e) =>
              setAdminName(e.target.value)
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="Admin Email"
            value={adminEmail}
            onChange={(e) =>
              setAdminEmail(e.target.value)
            }
          />
          <button
            onClick={createCompany}
            disabled={creating}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>

        <ul className="space-y-2">
          {companies.map((company) => (
            <li
              key={company._id}
              className="border p-3 rounded"
            >
              <p className="font-medium">
                {company.name}
              </p>
              <p className="text-sm text-gray-500">
                {company.managerEmail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
