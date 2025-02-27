"use client";

import { use } from "react";
import { PropertyParams } from "../types";
import { FloorPlanForm } from "./components/floor-plan-form";
import { FloorPlanList } from "./components/floor-plan-list";

interface Props {
  params: Promise<PropertyParams>;
}

export default function FloorPlansPage({ params }: Props) {
  const { propertyId } = use(params);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Floor Plans</h2>
        <FloorPlanForm propertyId={propertyId} />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Floor Plan Gallery</h3>
        <FloorPlanList propertyId={propertyId} />
      </div>
    </div>
  );
}
