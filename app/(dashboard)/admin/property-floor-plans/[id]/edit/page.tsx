"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import FloorPlanForm from "../../components/floor-plan-form";

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditFloorPlanPage({ params }: PageProps) {
  const { data: floorPlan, isLoading } = useQuery({
    queryKey: ["property-floor-plan", params.id],
    queryFn: async () => {
      const response = await axios.get(
        `/api/property-floor-plans/${params.id}`
      );
      return response.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Floor Plan</h1>
      <FloorPlanForm mode="edit" initialData={floorPlan} />
    </div>
  );
}
