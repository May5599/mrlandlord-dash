// "use client";

// import { useState, useEffect } from "react";
// import { fetchMutation } from "convex/nextjs";
// import { api } from "@/convex/_generated/api";

// type TenantSession = {
//   valid: boolean;
//   token: string;
// };

// type MaintenanceForm = {
//   title: string;
//   description: string;
//   category: string;
//   severity: string;
//   location: string;
//   accessPreference: string;
//   allowEntry: boolean;
//   // images: string[];
// };

// export default function MaintenancePage() {
//   const [session, setSession] = useState<TenantSession | null>(null);
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [loading, setLoading] = useState(false);



//   const [form, setForm] = useState<MaintenanceForm>({
//     title: "",
//     description: "",
//     category: "",
//     severity: "",
//     location: "",
//     accessPreference: "",
//     allowEntry: true,
//     // images: [],
//   });

//   useEffect(() => {
//     async function load() {
//       const res = await fetch("/api/tenant/get-session", {
//         credentials: "include",
//       });

//       const data = await res.json();

//       if (!data.valid || !data.token) {
//         window.location.href = "/tenant/login";
//         return;
//       }

//       setSession(data);
//     }

//     load();
//   }, []);

//   if (!session) return <p>Loading...</p>;

//   function updateField<K extends keyof MaintenanceForm>(
//     key: K,
//     value: MaintenanceForm[K]
//   ) {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   }

//   async function handleSubmit() {
//     setLoading(true);

//     if (!form.title || !form.description || !form.category || !form.severity) {
//       alert("Please fill all required fields");
//       setLoading(false);

//       return;
//     }

//     if (selectedFiles.length === 0) {
//   alert("Please upload at least one image");
//   setLoading(false);

//   return;
// }

// const storageIds: string[] = [];

// // for (const file of selectedFiles) {
// //   const uploadUrl = await fetchMutation(
// //     api.storage.generateUploadUrl,
// //     {}
// //   );
// try {
//   for (const file of selectedFiles) {
//     const uploadUrl = await fetchMutation(
//       api.storage.generateUploadUrl,
//       {}
//     );

//     const result = await fetch(uploadUrl, {
//       method: "POST",
//       headers: { "Content-Type": file.type },
//       body: file,
//     });

//     if (!result.ok) {
//       throw new Error("Upload failed");
//     }

//     const { storageId } = await result.json();
//     storageIds.push(storageId);
//   }
// } catch (error) {
//   alert("Image upload failed. Please try again.");
//   setLoading(false);

//   return;
// }


// //   const result = await fetch(uploadUrl, {
// //     method: "POST",
// //     headers: { "Content-Type": file.type },
// //     body: file,
// //   });

// //   const { storageId } = await result.json();
// //   storageIds.push(storageId);
// // }


//     if (!session) return;

//     await fetchMutation(api.tenantMaintenance.createRequest, {
//   token: session.token,
//   title: form.title,
//   description: form.description,
//   category: form.category,
//   severity: form.severity,
//   location: form.location,
//   accessPreference: form.accessPreference || undefined,
//   allowEntry: form.allowEntry,
//   images: storageIds,
// });

// setLoading(false);

// alert("Request submitted");
// window.location.href = "/tenant/dashboard";



//   return (
//     <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
//       <h1 className="text-2xl font-semibold mb-6">
//         Submit Maintenance Request
//       </h1>

//       <div className="space-y-4">
//         <input
//           placeholder="Short title"
//           className="w-full border p-2 rounded"
//           value={form.title}
//           onChange={(e) => updateField("title", e.target.value)}
//         />

//         <textarea
//           placeholder="Describe the issue"
//           className="w-full border p-2 rounded h-28"
//           value={form.description}
//           onChange={(e) => updateField("description", e.target.value)}
//         />

//         <select
//           className="w-full border p-2 rounded"
//           value={form.category}
//           onChange={(e) => updateField("category", e.target.value)}
//         >
//           <option value="">Select category</option>
//           <option value="plumbing">Plumbing</option>
//           <option value="electrical">Electrical</option>
//           <option value="hvac">Heating and cooling</option>
//           <option value="appliances">Appliances</option>
//           <option value="other">Other</option>
//         </select>

//         <select
//           className="w-full border p-2 rounded"
//           value={form.severity}
//           onChange={(e) => updateField("severity", e.target.value)}
//         >
//           <option value="">Severity</option>
//           <option value="low">Low</option>
//           <option value="medium">Medium</option>
//           <option value="high">High</option>
//           <option value="emergency">Emergency</option>
//         </select>

//         <select
//           className="w-full border p-2 rounded"
//           value={form.location}
//           onChange={(e) => updateField("location", e.target.value)}
//         >
//           <option value="">Location</option>
//           <option value="kitchen">Kitchen</option>
//           <option value="bathroom">Bathroom</option>
//           <option value="bedroom">Bedroom</option>
//         </select>

//         <select
//           className="w-full border p-2 rounded"
//           value={form.accessPreference}
//           onChange={(e) => updateField("accessPreference", e.target.value)}
//         >
//           <option value="">Access preference</option>
//           <option value="anytime">Any time</option>
//           <option value="appointment">By appointment</option>
//         </select>

//         <label className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             checked={form.allowEntry}
//             onChange={(e) => updateField("allowEntry", e.target.checked)}
//           />
//           Allow entry if away
//         </label>

//         {/* <input
//           type="file"
//           multiple
//           onChange={(e) => {
//             const files = Array.from(e.target.files ?? []).map((f) =>
//               URL.createObjectURL(f)
//             );
//             updateField("images", files);
//           }}
          
//         /> */}

//         {/* <input
//   type="file"
//   multiple
//   onChange={(e) => {
//     const files = Array.from(e.target.files ?? []);

//     for (const file of files) {
//       if (file.size > 4 * 1024 * 1024) {
//         alert("Each image must be under 4MB");
//         return;
//       }

//       if (!file.type.startsWith("image/")) {
//         alert("Only image files allowed");
//         return;
//       }
//     }

//     setSelectedFiles(files);
//   }}
// /> */}
// <div className="space-y-2">
//   <label className="block text-sm font-medium">
//     Upload Images (Max 4MB each)
//   </label>

//   <div
//     className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition"
//     onClick={() => document.getElementById("fileInput")?.click()}
//   >
//     <p className="text-gray-600">
//       Click to upload or drag images here
//     </p>
//     <p className="text-xs text-gray-400 mt-1">
//       PNG, JPG, JPEG up to 4MB
//     </p>
//   </div>

//   <input
//     id="fileInput"
//     type="file"
//     multiple
//     className="hidden"
//     onChange={(e) => {
//       const files = Array.from(e.target.files ?? []);

//       for (const file of files) {
//         if (file.size > 4 * 1024 * 1024) {
//           alert("Each image must be under 4MB");
//           return;
//         }

//         if (!file.type.startsWith("image/")) {
//           alert("Only image files allowed");
//           return;
//         }
//       }

//       setSelectedFiles(files);
//     }}
//   />

//   {selectedFiles.length > 0 && (
//     <div className="text-sm text-gray-600">
//       {selectedFiles.length} file(s) selected:
//       <ul className="mt-1 list-disc list-inside">
//         {selectedFiles.map((file, index) => (
//           <li key={index}>{file.name}</li>
//         ))}
//       </ul>
//     </div>
//   )}
// </div>



//         <button
//   onClick={handleSubmit}
//   disabled={loading}
//   className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
// >
//   {loading ? "Submitting..." : "Submit Request"}
// </button>

//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

type TenantSession = {
  valid: boolean;
  token: string;
};

type MaintenanceForm = {
  title: string;
  description: string;
  category: string;
  severity: string;
  location: string;
  accessPreference: string;
  allowEntry: boolean;
};

export default function MaintenancePage() {
  const [session, setSession] = useState<TenantSession | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<MaintenanceForm>({
    title: "",
    description: "",
    category: "",
    severity: "",
    location: "",
    accessPreference: "",
    allowEntry: true,
  });

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/tenant/get-session", {
        credentials: "include",
      });

      const data = await res.json();

      if (!data.valid || !data.token) {
        window.location.href = "/tenant/login";
        return;
      }

      setSession(data);
    }

    load();
  }, []);

  if (!session) return <p>Loading...</p>;

  function updateField<K extends keyof MaintenanceForm>(
    key: K,
    value: MaintenanceForm[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    setLoading(true);

    if (!form.title || !form.description || !form.category || !form.severity) {
      alert("Please fill all required fields");
      setLoading(false);
      return;
    }

    if (selectedFiles.length === 0) {
      alert("Please upload at least one image");
      setLoading(false);
      return;
    }

    const storageIds: string[] = [];

    try {
      for (const file of selectedFiles) {
        const uploadUrl = await fetchMutation(
          api.storage.generateUploadUrl,
          {}
        );

        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!result.ok) {
          throw new Error("Upload failed");
        }

        const { storageId } = await result.json();
        storageIds.push(storageId);
      }
    } catch (error) {
      alert("Image upload failed. Please try again.");
      setLoading(false);
      return;
    }

    if (!session) {
  setLoading(false);
  return;
}


    await fetchMutation(api.tenantMaintenance.createRequest, {
      token: session!.token,

      title: form.title,
      description: form.description,
      category: form.category,
      severity: form.severity,
      location: form.location,
      accessPreference: form.accessPreference || undefined,
      allowEntry: form.allowEntry,
      images: storageIds,
    });

    setLoading(false);
    alert("Request submitted");
    window.location.href = "/tenant/dashboard";
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h1 className="text-2xl font-semibold mb-6">
        Submit Maintenance Request
      </h1>

      <div className="space-y-4">
        <input
          placeholder="Short title"
          className="w-full border p-2 rounded"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
        />

        <textarea
          placeholder="Describe the issue"
          className="w-full border p-2 rounded h-28"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
        />

        <select
          className="w-full border p-2 rounded"
          value={form.category}
          onChange={(e) => updateField("category", e.target.value)}
        >
          <option value="">Select category</option>
          <option value="plumbing">Plumbing</option>
          <option value="electrical">Electrical</option>
          <option value="hvac">Heating and cooling</option>
          <option value="appliances">Appliances</option>
          <option value="other">Other</option>
        </select>

        <select
          className="w-full border p-2 rounded"
          value={form.severity}
          onChange={(e) => updateField("severity", e.target.value)}
        >
          <option value="">Severity</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="emergency">Emergency</option>
        </select>

        <select
          className="w-full border p-2 rounded"
          value={form.location}
          onChange={(e) => updateField("location", e.target.value)}
        >
          <option value="">Location</option>
          <option value="kitchen">Kitchen</option>
          <option value="bathroom">Bathroom</option>
          <option value="bedroom">Bedroom</option>
        </select>

        <select
          className="w-full border p-2 rounded"
          value={form.accessPreference}
          onChange={(e) => updateField("accessPreference", e.target.value)}
        >
          <option value="">Access preference</option>
          <option value="anytime">Any time</option>
          <option value="appointment">By appointment</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.allowEntry}
            onChange={(e) => updateField("allowEntry", e.target.checked)}
          />
          Allow entry if away
        </label>

        {/* Upload Section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Upload Images (Required)
          </label>

          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            <p className="text-gray-600 font-medium">
              Click to upload images
            </p>
            <p className="text-xs text-gray-400 mt-2">
              PNG, JPG, JPEG up to 4MB each
            </p>
          </div>

          <input
            id="fileInput"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);

              for (const file of files) {
                if (file.size > 4 * 1024 * 1024) {
                  alert("Each image must be under 4MB");
                  return;
                }

                if (!file.type.startsWith("image/")) {
                  alert("Only image files allowed");
                  return;
                }
              }

              setSelectedFiles((prev) => [...prev, ...files]);
            }}
          />

          {selectedFiles.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="relative border rounded-lg overflow-hidden"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-28 object-cover"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedFiles((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    className="absolute top-1 right-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </div>
    </div>
  );
}

