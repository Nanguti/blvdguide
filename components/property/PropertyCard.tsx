"use client";

import { motion } from "framer-motion";
import { Property } from "@/types/property";
import Image from "next/image";
import Link from "next/link";
import { Heart, Bed, Bath, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  href: string;
  priority?: boolean;
}

export default function PropertyCard({ property, href }: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(property.is_favorited);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/properties/${property.id}/favorite`, {
        method: "POST",
      });
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group bg-card rounded-xl overflow-hidden border shadow-sm hover:shadow-lg transition-shadow"
    >
      <Link href={href}>
        <div className="relative aspect-[4/3]">
          <Image
            src={property.imageUrl}
            alt={property.title}
            fill
            className={cn(
              "object-cover transition-transform duration-300",
              isHovered && "scale-110"
            )}
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm hover:bg-white"
            onClick={handleFavorite}
          >
            <Heart
              className={cn(
                "w-5 h-5 transition-colors",
                isFavorited && "fill-red-500 text-red-500"
              )}
            />
          </Button>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-2 left-2">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary text-white">
              {property.type}
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                {property.title}
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                {property.location.city.name},{" "}
                {property.location.city.state.name}
              </p>
            </div>
            <p className="text-lg font-bold text-primary">
              Ksh.{property.price.toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span className="text-sm">{property.bedrooms} beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span className="text-sm">{property.bathrooms} baths</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4" />
              <span className="text-sm">{property.area} sqft</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
