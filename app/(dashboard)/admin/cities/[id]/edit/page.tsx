"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CityForm from "../../components/city-form";

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditCityPage({ params }: PageProps) {
  const { data: city, isLoading } = useQuery({
    queryKey: ["city", params.id],
    queryFn: async () => {
      const response = await axios.get(`/api/cities/${params.id}`);
      return response.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit City</h1>
      <CityForm mode="edit" initialData={city} />
    </div>
  );
}
