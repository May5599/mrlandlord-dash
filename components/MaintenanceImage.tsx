// "use client";

// import { useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";

// export default function MaintenanceImage({
//   storageId,
// }: {
//   storageId: string;
// }) {
//   const imageUrl = useQuery(api.storage.getImageUrl, { storageId });

//   if (!imageUrl) {
//     return (
//       <div className="w-32 h-32 bg-gray-100 animate-pulse rounded-lg" />
//     );
//   }

//   return (
//     <img
//       src={imageUrl}
//       alt="Maintenance"
//       className="w-32 h-32 object-cover rounded-lg"
//     />
//   );
// }
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function MaintenanceImage({
  storageId,
}: {
  storageId: string;
}) {
  const imageUrl = useQuery(api.storage.getImageUrl, { storageId });

  if (!imageUrl) {
    return (
      <div className="w-full h-full bg-gray-200 animate-pulse" />
    );
  }

  return (
    <img
      src={imageUrl}
      alt="Maintenance"
      className="w-full h-full object-cover"
    />
  );
}
