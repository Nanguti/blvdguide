"use client";

import { Property } from "@/types/property";
import { motion } from "framer-motion";
import { Heart, Share2, Bed, Bath, Square } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { propertyService } from "@/lib/services/property";
import { cn } from "@/lib/utils";

interface PropertyInfoProps {
  property: Property;
}

export default function PropertyInfo({ property }: PropertyInfoProps) {
  const [isFavorited, setIsFavorited] = useState(property.is_favorited);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleFavorite = async () => {
    try {
      await propertyService.toggleFavorite(property.id.toString());
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.href,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {property.title}
          </h1>
          <p className="text-gray-600">{property.address}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleFavorite}
            className={isFavorited ? "text-red-500" : ""}
          >
            <Heart className={cn("w-5 h-5", isFavorited && "fill-current")} />
          </Button>
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-6 py-4 border-y">
        <div className="flex items-center gap-2">
          <Bed className="w-5 h-5 text-gray-400" />
          <span>{property.bedrooms} Beds</span>
        </div>
        <div className="flex items-center gap-2">
          <Bath className="w-5 h-5 text-gray-400" />
          <span>{property.bathrooms} Baths</span>
        </div>
        <div className="flex items-center gap-2">
          <Square className="w-5 h-5 text-gray-400" />
          <span>{property.area} sqft</span>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <motion.div
          initial={false}
          animate={{ height: showFullDescription ? "auto" : "100px" }}
          className="relative overflow-hidden"
        >
          <p className="text-gray-600">{property.description}</p>
          {!showFullDescription && (
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
          )}
        </motion.div>
        <Button
          variant="ghost"
          className="mt-2"
          onClick={() => setShowFullDescription(!showFullDescription)}
        >
          {showFullDescription ? "Show less" : "Read more"}
        </Button>
      </div>

      <div className="mt-6">
        <span className="text-3xl font-bold text-primary">
          ${property.price.toLocaleString()}
        </span>
      </div>
    </motion.div>
  );
}
