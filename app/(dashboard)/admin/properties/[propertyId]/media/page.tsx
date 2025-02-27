"use client";

import { use } from "react";
import { PropertyParams } from "../types";
import { MediaUpload } from "./components/media-upload";
import { MediaGallery } from "./components/media-gallery";

interface Props {
  params: Promise<PropertyParams>;
}

export default function MediaPage({ params }: Props) {
  const { propertyId } = use(params);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Property Media</h2>
        <MediaUpload propertyId={propertyId} />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Media Gallery</h3>
        <MediaGallery propertyId={propertyId} />
      </div>
    </div>
  );
}
