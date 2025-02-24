"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import PropertyForm from "@/components/properties/PropertyForm";
import { propertyService } from "@/lib/services/property";
import { Property } from "@/types/property";

export default function EditProperty({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { id } = use(params);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const response = await propertyService.getProperty(parseInt(id));
        setProperty(response.data);
      } catch (error) {
        console.error("Error loading property:", error);
        setError("Failed to load property");
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  const handleSubmit = async (data: any) => {
    try {
      await propertyService.updateProperty(parseInt(id), data);
      router.push("/dashboard/properties");
    } catch (error) {
      console.error("Error updating property:", error);
      setError("Failed to update property");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!property) return <div>Property not found</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Edit Property</h2>
      {error && <div className="text-red-500">{error}</div>}
      <PropertyForm property={property} onSubmit={handleSubmit} />
    </div>
  );
}
