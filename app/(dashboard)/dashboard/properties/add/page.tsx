"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PropertyForm from "@/components/properties/PropertyForm";
import { propertyService } from "@/lib/services/property";
import { Property } from "@/types/property";

interface PropertyFormData extends Omit<Property, "id"> {
  featured_image?: File;
}

export default function AddProperty() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: PropertyFormData) => {
    try {
      console.log("AddProperty handleSubmit data:", data);
      const response = await propertyService.createProperty(data);
      console.log("Create property response:", response);
      router.push("/dashboard/properties");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create property";
      console.error("Error creating property:", error);
      setError(errorMessage);
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
