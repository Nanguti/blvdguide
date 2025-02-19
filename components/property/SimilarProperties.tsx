"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Property } from "@/types/property";
import { useState, useRef } from "react";
import PropertyCard from "./PropertyCard";
import { cn } from "@/lib/utils";

interface SimilarPropertiesProps {
  propertyId: string;
  cityId: string;
}

export default function SimilarProperties({
  propertyId,
  cityId,
}: SimilarPropertiesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { data: properties } = useQuery<Property[]>({
    queryKey: ["similarProperties", propertyId, cityId],
    queryFn: async () => {
      const response = await fetch(
        `/api/properties/similar?property_id=${propertyId}&city_id=${cityId}`
      );
      return response.json();
    },
  });

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = direction === "left" ? -400 : 400;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  if (!properties?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Similar Properties</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={cn(!canScrollLeft && "opacity-50 cursor-not-allowed")}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={cn(!canScrollRight && "opacity-50 cursor-not-allowed")}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
      >
        {properties.map((property, index) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="min-w-[300px] snap-start"
          >
            <PropertyCard property={property} />
          </motion.div>
        ))}
      </div>

      {/* Mobile Scroll Indicator */}
      <div className="mt-4 flex gap-1 justify-center md:hidden">
        {properties.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-colors",
              index === 0 ? "bg-primary" : "bg-gray-200"
            )}
          />
        ))}
      </div>
    </motion.div>
  );
}
