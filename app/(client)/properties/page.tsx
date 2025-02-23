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
      type: "Villa",
      status: "For Sale",
      bedrooms: 4,
      bathrooms: 3,
      area: 3200,
      address: "123 Garden Lane",
      imageUrl: "/images/featured/1.jpg",
      featured_image: "/images/featured/1.jpg",
      images: ["/images/featured/1.jpg"],
      amenities: [
        { id: "1", name: "Swimming Pool", icon: "pool", category: "Exterior" },
        { id: "2", name: "Garden", icon: "garden", category: "Exterior" },
      ],
      is_favorited: false,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
      location: {
        city: { name: "Beverly Hills", state: { name: "California" } },
        latitude: 34.0736,
        longitude: -118.4004,
      },
      agent: {
        id: "1",
        name: "John Smith",
        email: "john@example.com",
        phone: "123-456-7890",
        avatar: "/images/agents/1.jpg",
        experience: 8,
        properties: 124,
        rating: 4.9,
        specialization: "Luxury Homes",
        languages: ["English", "Spanish"],
        about: "Experienced luxury real estate agent",
      },
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
