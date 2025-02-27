"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AreaForm from "../../components/area-form";

interface Area {
  id?: number;
  name: string;
  description: string;
  cityId: string;
}

export default function EditAreaPage({ params }: { params: { id: string } }) {
  const { data: area, isLoading } = useQuery<Area>({
    queryKey: ["area", params.id],
    queryFn: async () => {
      const response = await axios.get(`/api/areas/${params.id}`);
      return response.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Area</h1>
      <AreaForm mode="edit" initialData={area} />
    </div>
  );
}
