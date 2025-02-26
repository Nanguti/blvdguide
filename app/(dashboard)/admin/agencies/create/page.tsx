"use client";

import AgencyForm from "../components/agency-form";

export default function CreateAgencyPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Create Agency</h1>
      <AgencyForm mode="create" />
    </div>
  );
}
