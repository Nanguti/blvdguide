"use client";

import AmenityForm from "../components/amenity-form";

export default function CreateAmenityPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Create Amenity</h1>
      <AmenityForm mode="create" />
    </div>
  );
}
