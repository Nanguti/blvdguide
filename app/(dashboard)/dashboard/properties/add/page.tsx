"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PropertyForm from "@/components/properties/PropertyForm";
import { propertyService } from "@/lib/services/property";

export default function AddProperty() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    try {
      console.log("AddProperty handleSubmit data:", data);
      const response = await propertyService.createProperty(data);
      console.log("Create property response:", response);
      router.push("/dashboard/properties");
    } catch (error: any) {
      console.error("Error creating property:", error.response?.data || error);
      setError("Failed to create property");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Add New Property</h2>
      {error && <div className="text-red-500">{error}</div>}
      <PropertyForm onSubmit={handleSubmit} />
    </div>
  );
}
