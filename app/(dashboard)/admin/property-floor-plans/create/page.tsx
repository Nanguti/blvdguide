"use client";

import FloorPlanForm from "../components/floor-plan-form";

export default function CreateFloorPlanPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Create Floor Plan</h1>
      <FloorPlanForm mode="create" />
    </div>
  );
}
