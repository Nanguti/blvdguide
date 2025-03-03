"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PropertyCard from "@/components/property/PropertyCard";
import PropertyFilter from "@/components/property/PropertyFilter";
import { Loader2 } from "lucide-react";
import { Property, PropertyFilter as FilterType } from "@/types/property";

// Sample data - replace with API call later
const sampleProperties = {
  data: [
    {
      id: 1,
      title: "Modern Garden Villa",
      description: "Beautiful villa with expansive gardens and pool",
      price: 850000,
      property_type_id: 1,
      property_status_id: 1,
      city_id: 1,
      bedrooms: 4,
      bathrooms: 3,
      garages: 2,
      year_built: 2020,
      area: 3200,
      address: "123 Garden Lane",
      latitude: 34.0736,
      longitude: -118.4004,
      propertyType: { id: 1, name: "Villa" },
      propertyStatus: { id: 1, name: "For Sale" },
      city: { id: 1, name: "Beverly Hills" },
      published_status: "published",
    },
    // Add more properties...
  ],
};

export default function PropertiesPage() {
  const [filters, setFilters] = useState<FilterType>({});

  const { data: propertiesData, status } = useQuery({
    queryKey: ["properties", filters],
    queryFn: () => Promise.resolve(sampleProperties),
  });

  const properties = propertiesData?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Filters Section */}
        <PropertyFilter initialFilters={filters} onFilterChange={setFilters} />

        {/* Properties Grid */}
        <div className="mt-8">
          {status === "pending" ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property: Property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  href={`/properties/${property.id}`}
                />
              ))}
            </div>
          )}

          {/* No Results */}
          {properties.length === 0 && (
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
