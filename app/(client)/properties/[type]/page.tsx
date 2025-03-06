"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PropertyCard from "@/components/property/PropertyCard";
import PropertyFilter from "@/components/property/PropertyFilter";
import { Loader2 } from "lucide-react";
import { Property, PropertyFilter as FilterType } from "@/types/property";
import { useParams } from "next/navigation";
import { propertyService } from "@/lib/services/property";

// Property type configurations
const propertyTypes = {
  "for-sale": { title: "Properties for Sale", status: "sale" },
  "for-rent": { title: "Properties for Rent", status: "rent" },
  "new-development": { title: "New Developments", status: "new" },
  "recently-sold": { title: "Recently Sold Properties", status: "sold" },
};

export default function PropertiesTypePage() {
  const params = useParams();
  const propertyType = params.type as string;
  const typeConfig = propertyTypes[propertyType as keyof typeof propertyTypes];

  const [filters, setFilters] = useState<FilterType>({
    status: typeConfig?.status,
  });

  const { data: propertiesData, status } = useQuery({
    queryKey: ["properties", propertyType, filters],
    queryFn: () => propertyService.getProperties(propertyType, filters),
  });

  const properties = propertiesData?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {typeConfig?.title || "Properties"}
        </h1>

        {/* Filters Section */}
        <PropertyFilter
          initialFilters={filters}
          onFilterChange={setFilters}
          propertyType={propertyType}
        />

        {/* Properties Grid */}
        <div className="mt-8">
          {status === "pending" ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property: Property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          {/* No Results */}
          {properties.length === 0 && status !== "pending" && (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-gray-900">
                No properties found
              </h3>
              <p className="text-gray-600 mt-2">
                Try adjusting your filters to find what you are looking for
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
