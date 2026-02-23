"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSessionToken } from "@/hooks/useSessionToken";
import { Id } from "@/convex/_generated/dataModel";
import MaintenanceImage from "@/components/MaintenanceImage";

export default function TenantDocumentsPage() {
  const token = useSessionToken();
  const isReady = !!token;

  const profile =
    useQuery(
      api.tenantProfiles.getMyProfile,
      isReady ? { token } : "skip"
    ) ?? null;

  if (!profile) {
    return <div className="p-8">Loading documents…</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">
          My Submitted Documents
        </h1>
        <p className="text-gray-500 mt-1">
          View all documents submitted with your application
        </p>
      </div>

      {profile.documents?.length ? (
        <div className="grid md:grid-cols-3 gap-6">
          {profile.documents.map((doc: any, index: number) => (
            <div
              key={index}
              className="bg-white border rounded-2xl shadow-sm p-4"
            >
              <p className="font-medium capitalize mb-2">
                {doc.type.replace("_", " ")}
              </p>

              <div className="relative h-48 w-full bg-gray-100 rounded-lg overflow-hidden mb-3">
                <MaintenanceImage storageId={doc.storageId} />
              </div>

              <p className="text-xs text-gray-500">
                Uploaded:{" "}
                {new Date(doc.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-xl text-gray-500">
          No documents submitted yet.
        </div>
      )}
    </div>
  );
}