"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/services/api";
import AgencyForm from "../../components/agency-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditAgencyPage({ params }: PageProps) {
  const { id } = use(params);

  const { data: agency, isLoading } = useQuery({
    queryKey: ["agencies", id],
    queryFn: async () => {
      const response = await api.get(`/agencies/${id}`);
      return response.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Agency</h1>
      <AgencyForm mode="edit" initialData={agency} />
    </div>
  );
}
