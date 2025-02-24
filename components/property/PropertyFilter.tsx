"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/lib/services/property";
import { PropertyFilter as FilterType } from "@/types/property";
import {
  RangeSlider,
  Select,
  MultiSelect,
  Button,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui";
import { Filter } from "lucide-react";

interface PropertyType {
  id: string;
  name: string;
}

interface Amenity {
  id: string;
  name: string;
}

interface PropertyFilterProps {
  initialFilters: FilterType;
  onFilterChange: (filters: FilterType) => void;
}

export default function PropertyFilter({
  initialFilters,
  onFilterChange,
}: PropertyFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [areaRange, setAreaRange] = useState<[number, number]>([0, 10000]);

  const { data: propertyTypes } = useQuery({
    queryKey: ["propertyTypes"],
    queryFn: propertyService.getPropertyTypes,
  });

  const { data: amenities } = useQuery({
    queryKey: ["amenities"],
    queryFn: propertyService.getAmenities,
  });

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onFilterChange(filters);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [filters, onFilterChange]);

  const handleReset = () => {
    setFilters({});
    setPriceRange([0, 1000000]);
    setAreaRange([0, 10000]);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
        {Object.keys(filters).length > 0 && (
          <Button
            variant="ghost"
            onClick={handleReset}
            className="text-red-500"
          >
            Clear all
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Property Type</label>
                <Select
                  value={filters.type}
                  onValueChange={(value) =>
                    setFilters({ ...filters, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes?.map((type: PropertyType) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Price Range</label>
                <RangeSlider
                  min={0}
                  max={1000000}
                  step={1000}
                  value={priceRange}
                  onChange={(value) => {
                    setPriceRange(value);
                    setFilters({
                      ...filters,
                      min_price: value[0],
                      max_price: value[1],
                    });
                  }}
                  formatLabel={(value) => `$${value.toLocaleString()}`}
                />
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Beds</label>
                    <Select
                      value={filters.bedrooms?.toString()}
                      onValueChange={(value) =>
                        setFilters({ ...filters, bedrooms: Number(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Beds" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <SelectItem key={n} value={n.toString()}>
                            {n}+ beds
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Baths</label>
                    <Select
                      value={filters.bathrooms?.toString()}
                      onValueChange={(value) =>
                        setFilters({ ...filters, bathrooms: Number(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Baths" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <SelectItem key={n} value={n.toString()}>
                            {n}+ baths
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Area (sq ft)</label>
                <RangeSlider
                  min={0}
                  max={10000}
                  step={100}
                  value={areaRange}
                  onChange={(value) => {
                    setAreaRange(value);
                    setFilters({
                      ...filters,
                      min_area: value[0],
                      max_area: value[1],
                    });
                  }}
                  formatLabel={(value) => `${value.toLocaleString()} sq ft`}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium">Amenities</label>
              <MultiSelect
                value={filters.amenities || []}
                onChange={(value) =>
                  setFilters({ ...filters, amenities: value })
                }
                options={amenities?.map((amenity: Amenity) => ({
                  label: amenity.name,
                  value: amenity.id,
                }))}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
