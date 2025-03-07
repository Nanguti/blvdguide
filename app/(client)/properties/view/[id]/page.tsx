"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  MapPin,
  Bed,
  Bath,
  Ruler,
  Heart,
  Share2,
  Calendar,
  Car,
  Building2,
  CheckCircle2,
} from "lucide-react";
import PropertyGallery from "@/components/properties/PropertyGallery";
import { propertyService } from "@/lib/services/property";
import Loading from "@/components/Loading";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Property } from "@/types/property";

interface PropertyAmenity {
  id: number;
  name: string;
  icon?: string;
  category?: string;
}

interface MediaItem {
  id: number;
  property_id: number;
  type: string;
  url: string;
  sort_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

function PropertyContent() {
  const params = useParams();
  const id = params.id as string;
  const mediaUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  const { data, isLoading, error } = useQuery<Property>({
    queryKey: ["property", id],
    queryFn: () => propertyService.getProperty(Number(id)),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading || !data) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl font-semibold text-gray-900">
          Error loading property
        </h3>
      </div>
    );
  }

  const property = data;

  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) {
      const randomNum = Math.floor(Math.random() * 4) + 1;
      return `/images/featured/${randomNum}.jpg`;
    }
    return `${mediaUrl}/${imagePath}`;
  };

  // Prepare gallery images
  const galleryImages = [
    getImageUrl(property.featured_image),
    ...(property.media || []).map((image: MediaItem) =>
      getImageUrl(`storage/${image.url}`)
    ),
  ].filter(Boolean);

  if (galleryImages.length === 0) {
    galleryImages.push("/images/featured/1.jpg");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Hero Section with Gallery */}
      <div className="container mx-auto px-4 py-8">
        <PropertyGallery images={galleryImages} title={property.title} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-10">
        {/* Property Title and Badge */}
        <div className="text-center mb-8">
          {property.featured === 1 && (
            <Badge className="mb-4 bg-primary/90 hover:bg-primary">
              Featured Property
            </Badge>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {property.title}
          </h1>
          <p className="text-gray-600 text-lg">{property.address}</p>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-semibold text-gray-900">
                  Ksh.{Number(property.price).toLocaleString()}
                </h2>
                <Badge variant="outline" className="h-fit">
                  {property.type === "sale" ? "For Sale" : "For Rent"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-primary/10">
                  {property.property_status?.name || "N/A"}
                </Badge>
                <Badge variant="secondary" className="bg-primary/10">
                  {property.property_type?.name || "N/A"}
                </Badge>
              </div>
              <p className="text-gray-600 mt-6">{property.description}</p>
            </motion.div>

            <div className="mt-8 grid grid-cols-2 gap-6">
              <div className="flex items-center gap-2">
                <Bed className="w-6 h-6 text-primary" />
                <span>{property.bedrooms} Bedrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="w-6 h-6 text-primary" />
                <span>{property.bathrooms} Bathrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Ruler className="w-6 h-6 text-primary" />
                <span>{property.area} sq ft</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-6 h-6 text-primary" />
                <span>{property.garages} Garages</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary" />
                <span>Built in {property.year_built}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-primary" />
                <span>{property.city?.name || "N/A"}</span>
              </div>
            </div>

            {/* Additional Property Info */}
            <div className="mt-8 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Location Details</h3>
                <div className="grid gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>{property.address}</span>
                  </div>
                  {property.latitude && property.longitude && (
                    <div className="text-sm text-gray-500">
                      Coordinates: {property.latitude}, {property.longitude}
                    </div>
                  )}
                </div>
              </div>

              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {property.amenities.map((amenity: PropertyAmenity) => (
                      <div key={amenity.id} className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        <span>{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {property.features && property.features.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Features</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {property.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Additional Info */}
          <div className="space-y-6">
            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white shadow-lg rounded-lg p-6"
            >
              <h3 className="text-xl font-semibold mb-4">Property Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed On</span>
                  <span className="font-medium">
                    {formatDate(property.created_at)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type</span>
                  <span className="font-medium">
                    {property.property_type?.name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium">
                    {property.property_status?.name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">City</span>
                  <span className="font-medium">
                    {property.city?.name || "N/A"}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition">
                Schedule Viewing
              </button>
              <button className="p-3 border rounded-lg shadow hover:bg-gray-100 transition">
                <Heart
                  className={`w-6 h-6 ${
                    property.is_favorited
                      ? "fill-red-500 text-red-500"
                      : "text-gray-700"
                  }`}
                />
              </button>
              <button className="p-3 border rounded-lg shadow hover:bg-gray-100 transition">
                <Share2 className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function PropertyDetailPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PropertyContent />
    </Suspense>
  );
}
