"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Search, Sliders, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { MultiSelect } from "@/components/ui/multi-select";
import { debounce } from "lodash";
import SectionWrapper from "./SectionWrapper";
import { cn } from "@/lib/utils";

interface Location {
  id: string;
  name: string;
  state: string;
}

interface SearchFilters {
  location: string;
  propertyType: string[];
  priceRange: [number, number];
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
}

export default function PropertySearch() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    propertyType: [],
    priceRange: [0, 2000000],
    bedrooms: 0,
    bathrooms: 0,
    amenities: [],
  });

  const { data: locations } = useQuery<Location[]>({
    queryKey: ["locations", filters.location],
    queryFn: async () => {
      if (!filters.location) return [];
      const response = await fetch(
        `/api/locations/search?q=${filters.location}`
      );
      return response.json();
    },
    enabled: filters.location.length > 2,
  });

  const debouncedLocationSearch = useCallback(
    (value: string) => {
      setFilters((prev) => ({ ...prev, location: value }));
    },
    [setFilters]
  );

  const debouncedSearch = debounce(debouncedLocationSearch, 300);

  const propertyTypes = [
    { label: "House", value: "house" },
    { label: "Apartment", value: "apartment" },
    { label: "Condo", value: "condo" },
    { label: "Villa", value: "villa" },
  ];

  const amenities = [
    { label: "Pool", value: "pool" },
    { label: "Gym", value: "gym" },
    { label: "Parking", value: "parking" },
    { label: "Security", value: "security" },
    { label: "Garden", value: "garden" },
  ];

  return (
    <SectionWrapper className="bg-muted/50">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter location..."
              className="pl-10 h-12"
              onChange={(e) => debouncedSearch(e.target.value)}
            />
            <AnimatePresence>
              {(locations?.length ?? 0) > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute z-10 left-0 right-0 mt-1 bg-background border rounded-md shadow-lg"
                >
                  {locations?.map((location) => (
                    <button
                      key={location.id}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          location: `${location.name}, ${location.state}`,
                        }))
                      }
                      className="w-full px-4 py-2 text-left hover:bg-muted transition-colors"
                    >
                      {location.name}, {location.state}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2",
              showFilters && "bg-primary text-primary-foreground"
            )}
          >
            <Sliders className="w-4 h-4" />
            Filters
          </Button>

          <Button size="lg" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search
          </Button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                <div className="space-y-4">
                  <label className="text-sm font-medium">Property Type</label>
                  <MultiSelect
                    value={filters.propertyType}
                    onChange={(value) =>
                      setFilters((prev) => ({ ...prev, propertyType: value }))
                    }
                    options={propertyTypes}
                    placeholder="Select types..."
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium">Price Range</label>
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        priceRange: value as [number, number],
                      }))
                    }
                    min={0}
                    max={2000000}
                    step={50000}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${filters.priceRange[0].toLocaleString()}</span>
                    <span>${filters.priceRange[1].toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium">Amenities</label>
                  <MultiSelect
                    value={filters.amenities}
                    onChange={(value) =>
                      setFilters((prev) => ({ ...prev, amenities: value }))
                    }
                    options={amenities}
                    placeholder="Select amenities..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Beds</label>
                    <Input
                      type="number"
                      min={0}
                      value={filters.bedrooms}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          bedrooms: parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Baths</label>
                    <Input
                      type="number"
                      min={0}
                      value={filters.bathrooms}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          bathrooms: parseInt(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  );
}
