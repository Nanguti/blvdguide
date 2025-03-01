"use client";

import { Property } from "@/types/property";
import { Button } from "@/components/ui/button";
import { ChevronRight, Link } from "lucide-react";
import PropertyCard from "@/components/property/PropertyCard";
import SectionWrapper from "./SectionWrapper";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/services/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedProperties() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["featuredProperties"],
    queryFn: async () => {
      const response = await api.get("/featured-properties");
      return response.data as Property[];
    },
  });

  const properties = data;

  return (
    <SectionWrapper>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">Featured Properties</h2>
          <p className="text-muted-foreground mt-2">
            Explore our handpicked selection of premium properties
          </p>
        </div>
        <Link href="/properties">
          <Button variant="ghost" className="hidden sm:flex items-center gap-2">
            View All Properties
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8 text-muted-foreground">
          Failed to load featured properties. Please try again later.
        </div>
      ) : properties && properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              href={`/properties/${property.id}`}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No featured properties available.
        </div>
      )}
    </SectionWrapper>
  );
}
