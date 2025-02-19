"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, MapPin, Bath, Bed, Move, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Types remain the same as before
interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  isFeatured: boolean;
}

interface FilterState {
  type: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
  location: string;
}

// Property Card Component with enhanced design
const PropertyCard = ({ property }: { property: Property }) => {
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="relative">
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
        </div>

        {/* Price Tag */}
        <div className="absolute top-4 left-4">
          <span className="bg-white px-4 py-2 rounded-full text-primary font-bold shadow-lg">
            ${property.price.toLocaleString()}
          </span>
        </div>

        {/* Featured Badge */}
        {property.isFeatured && (
          <div className="absolute top-4 right-4">
            <span className="bg-primary text-white px-4 py-2 rounded-full font-semibold shadow-lg">
              Featured
            </span>
          </div>
        )}

        {/* Favorite Button */}
        <button className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-primary hover:text-white transition-colors">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6">
        {/* Property Type */}
        <div className="mb-3">
          <span className="text-primary text-sm font-semibold">
            {property.type}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-2 text-primary" />
          <span className="text-sm">{property.location}</span>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-100">
          <div className="flex items-center text-gray-600">
            <Bed className="w-4 h-4 mr-2 text-primary" />
            <span className="text-sm">{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Bath className="w-4 h-4 mr-2 text-primary" />
            <span className="text-sm">{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Move className="w-4 h-4 mr-2 text-primary" />
            <span className="text-sm">{property.area} sqft</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Filter Component
const PropertyFilter = ({
  onFilterChange,
}: {
  onFilterChange: (filters: FilterState) => void;
}) => {
  const [filters, setFilters] = useState<FilterState>({
    type: "",
    minPrice: 0,
    maxPrice: 0,
    bedrooms: 0,
    location: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Find Your Perfect Property
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {/* Type Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Property Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            >
              <option value="">Any Type</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Studio">Studio</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Min Price
            </label>
            <input
              type="number"
              value={filters.minPrice || ""}
              onChange={(e) =>
                setFilters({ ...filters, minPrice: Number(e.target.value) })
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              placeholder="Min Price"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Max Price
            </label>
            <input
              type="number"
              value={filters.maxPrice || ""}
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: Number(e.target.value) })
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              placeholder="Max Price"
            />
          </div>

          {/* Bedrooms */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Bedrooms
            </label>
            <input
              type="number"
              value={filters.bedrooms || ""}
              onChange={(e) =>
                setFilters({ ...filters, bedrooms: Number(e.target.value) })
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              placeholder="Min Bedrooms"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              placeholder="Enter location"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 transition-all"
          >
            Search Properties
          </button>
        </div>
      </form>
    </div>
  );
};

// Main Page Component
export default function PropertiesPage() {
  const [filters, setFilters] = useState<FilterState>({
    type: "",
    minPrice: 0,
    maxPrice: 0,
    bedrooms: 0,
    location: "",
  });

  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties", filters],
    queryFn: () => getProperties(filters),
    initialData: [],
  });

  const propertyList = Array.isArray(properties) ? properties : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-2 tracking-tight">
            Discover Your Dream Home
          </h1>
          <p className="text-gray-600 text-xl mb-8 max-w-4xl">
            Explore our curated collection of exceptional properties, each
            telling its own unique story
          </p>

          <PropertyFilter onFilterChange={setFilters} />
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-20"
            >
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </motion.div>
          ) : (
            <motion.div
              key="properties"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {propertyList.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!isLoading && propertyList.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-xl shadow-lg mt-8 border border-gray-100"
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No Properties Found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria to find more properties
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Sample data
const sampleProperties: Property[] = [
  {
    id: 1,
    title: "Modern Skyline Penthouse",
    price: 1250000,
    location: "Downtown Manhattan",
    type: "Penthouse",
    bedrooms: 3,
    bathrooms: 2.5,
    area: 2200,
    imageUrl:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3",
    isFeatured: true,
  },
  {
    id: 2,
    title: "Luxury Beach Villa",
    price: 2100000,
    location: "Malibu Beach",
    type: "Villa",
    bedrooms: 4,
    bathrooms: 3,
    area: 3500,
    imageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3",
    isFeatured: true,
  },
  {
    id: 3,
    title: "Contemporary Urban Loft",
    price: 850000,
    location: "Brooklyn",
    type: "Loft",
    bedrooms: 2,
    bathrooms: 2,
    area: 1800,
    imageUrl:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?ixlib=rb-4.0.3",
    isFeatured: false,
  },
  {
    id: 4,
    title: "Glass House in the Woods",
    price: 1750000,
    location: "Aspen",
    type: "House",
    bedrooms: 3,
    bathrooms: 2.5,
    area: 2800,
    imageUrl:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3",
    isFeatured: true,
  },
  // Add more properties as needed
];

// Mock API call
const getProperties = (filters: FilterState): Promise<Property[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredProperties = [...sampleProperties];

      if (filters.type) {
        filteredProperties = filteredProperties.filter(
          (p) => p.type === filters.type
        );
      }
      if (filters.minPrice) {
        filteredProperties = filteredProperties.filter(
          (p) => p.price >= filters.minPrice
        );
      }
      if (filters.maxPrice) {
        filteredProperties = filteredProperties.filter(
          (p) => p.price <= filters.maxPrice
        );
      }
      if (filters.bedrooms) {
        filteredProperties = filteredProperties.filter(
          (p) => p.bedrooms >= filters.bedrooms
        );
      }
      if (filters.location) {
        filteredProperties = filteredProperties.filter((p) =>
          p.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      resolve(filteredProperties);
    }, 500); // Simulate network delay
  });
};
