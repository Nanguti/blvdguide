"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import MediaForm from "../../components/media-form";

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditMediaPage({ params }: PageProps) {
  const { data: media, isLoading } = useQuery({
    queryKey: ["property-media", params.id],
    queryFn: async () => {
      const response = await axios.get(`/api/property-media/${params.id}`);
      return response.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Property Media</h1>
      <MediaForm mode="edit" initialData={media} />
    </div>
  );
}
