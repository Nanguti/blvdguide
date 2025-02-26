"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/services/api";
import AmenityForm from "../../components/amenity-form";
import { use } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditAmenityPage({ params }: PageProps) {
  const { id } = use(params);

  const { data: amenity, isLoading } = useQuery({
    queryKey: ["amenity", id],
    queryFn: async () => {
      const response = await api.get(`/amenities/${id}`);
      return response.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Amenity</h1>
      <AmenityForm mode="edit" initialData={amenity} />
    </div>
  );
}
