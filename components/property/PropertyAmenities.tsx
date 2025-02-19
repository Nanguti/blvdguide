"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Amenity } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PropertyAmenitiesProps {
  amenities: Amenity[];
}

// Group amenities by category
const categories = [
  "Interior",
  "Exterior",
  "Security",
  "Climate Control",
  "Entertainment",
  "Other",
];

export default function PropertyAmenities({
  amenities,
}: PropertyAmenitiesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAmenities = amenities.filter((amenity) => {
    const matchesSearch = amenity.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || amenity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-xl font-semibold mb-4">Amenities</h2>

      <div className="space-y-4">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search amenities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category ? null : category
                  )
                }
                className="transition-all duration-300"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Amenities Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredAmenities.map((amenity) => (
              <motion.div
                key={amenity.id}
                variants={itemVariants}
                layout
                className={cn(
                  "flex items-center gap-2 p-3 rounded-lg border transition-colors",
                  "hover:border-primary/50 hover:bg-primary/5"
                )}
              >
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {/* You can use a dynamic icon component here */}
                    <span
                      className="text-primary"
                      dangerouslySetInnerHTML={{ __html: amenity.icon }}
                    />
                  </motion.div>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {amenity.name}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredAmenities.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-500"
          >
            No amenities found matching your criteria
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
