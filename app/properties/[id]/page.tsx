"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Loader2, MapPin, Bed, Bath, Ruler, Heart, Share2 } from "lucide-react";
import Image from "next/image";

// Mock API call (replace with real API request)
const fetchProperty = async (id: string) => {
  return Promise.resolve({
    id,
    title: "Modern Garden Villa",
    description: "Beautiful villa with expansive gardens and pool",
    price: 850000,
    type: "Villa",
    status: "For Sale",
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    address: "123 Garden Lane",
    featured_image: "/images/featured/1.jpg",
    images: ["/images/featured/1.jpg", "/images/featured/2.jpg"],
    agent: {
      id: "1",
      name: "John Smith",
      avatar: "/images/agents/1.jpg",
      experience: 8,
      phone: "123-456-7890",
    },
  });
};

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    data: property,
    status,
    isLoading,
  } = useQuery({
    queryKey: ["property", id],
    queryFn: () => fetchProperty(id),
  });

  if (isLoading || status === "pending") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl font-semibold text-gray-900">
          Property not found
        </h3>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Hero Section */}
      <div className="relative w-full h-[60vh]">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full"
        >
          <Image
            src={property.featured_image}
            alt={property.title}
            fill
            className="rounded-b-3xl shadow-lg object-cover"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            {property.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-10">
        {/* Property Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Section */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl font-semibold text-gray-900"
            >
              ${property?.price?.toLocaleString() || "N/A"} -{" "}
              {property?.status || "Unknown"}
            </motion.h2>
            <p className="text-gray-600 mt-2">{property.description}</p>

            <div className="mt-6 grid grid-cols-2 gap-4">
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
                <MapPin className="w-6 h-6 text-primary" />
                <span>{property.address}</span>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-2 gap-4">
            {property.images?.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative aspect-square w-full overflow-hidden rounded-lg shadow-lg"
              >
                <Image
                  src={img}
                  alt={`Property image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </motion.div>
            )) || (
              <div className="col-span-2 text-center py-8 text-gray-500">
                No additional images available
              </div>
            )}
          </div>
        </div>

        {/* Agent Info */}
        {property.agent ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 p-6 bg-white shadow-lg rounded-lg flex items-center gap-6"
          >
            {property.agent.avatar && (
              <div className="relative w-20 h-20">
                <Image
                  src={property.agent.avatar}
                  alt={property.agent.name || "Agent"}
                  fill
                  className="rounded-full object-cover shadow-md"
                />
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold">
                {property.agent.name || "Agent Name Not Available"}
              </h3>
              <p className="text-gray-600">
                Experience: {property.agent.experience || "N/A"} years
              </p>
              <p className="text-gray-600">
                Phone: {property.agent.phone || "N/A"}
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="mt-10 p-6 bg-white shadow-lg rounded-lg text-center text-gray-500">
            Agent information not available
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <button className="px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-primary-dark transition">
            Contact Agent
          </button>
          <button className="p-3 border rounded-lg shadow hover:bg-gray-100 transition">
            <Heart className="w-6 h-6 text-gray-700" />
          </button>
          <button className="p-3 border rounded-lg shadow hover:bg-gray-100 transition">
            <Share2 className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
