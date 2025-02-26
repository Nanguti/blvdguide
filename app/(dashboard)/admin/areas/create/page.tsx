"use client";

import AreaForm from "../components/area-form";

export default function CreateAreaPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Create Area</h1>
      <AreaForm mode="create" />
    </div>
  );
}
