"use client";

import MediaForm from "../components/media-form";

export default function CreateMediaPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Add Property Media</h1>
      <MediaForm mode="create" />
    </div>
  );
}
