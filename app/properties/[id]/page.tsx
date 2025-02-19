"use client";

import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/lib/services/property";
import PropertyGallery from "@/components/property/PropertyGallery";
import PropertyInfo from "@/components/property/PropertyInfo";
import PropertyAmenities from "@/components/property/PropertyAmenities";
import PropertyLocation from "@/components/property/PropertyLocation";
import PropertyAgent from "@/components/property/PropertyAgent";
import PropertyReviews from "@/components/property/PropertyReviews";
import SimilarProperties from "@/components/property/SimilarProperties";
import { Loader2 } from "lucide-react";

interface PropertyPageProps {
  params: {
    id: string;
  };
}

export default function PropertyDetailPage({ params }: PropertyPageProps) {
  const { data: property, status } = useQuery({
    queryKey: ["property", params.id],
    queryFn: () => propertyService.getProperty(params.id),
  });

  if (status === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!property) {
    return <div>Property not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PropertyGallery images={property.images} title={property.title} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <PropertyInfo property={property} />
            <PropertyAmenities amenities={property.amenities} />
            <PropertyLocation property={property} />
            <PropertyReviews propertyId={property.id} />
          </div>

          <div className="space-y-8">
            <PropertyAgent agent={property.agent} />
            <SimilarProperties
              propertyId={property.id}
              cityId={property.location.city.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
