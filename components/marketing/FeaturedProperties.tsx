"use client";

import { Property } from "@/types/property";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import PropertyCard from "@/components/property/PropertyCard";
import SectionWrapper from "./SectionWrapper";

// Sample data - replace with API call later
const sampleProperties: Property[] = [
  {
    id: 1,
    title: "Modern Garden Villa",
    description: "Beautiful villa with expansive gardens and pool",
    price: 850000,
    property_type_id: 1,
    property_status_id: 1,
    city_id: 1,
    bedrooms: 4,
    bathrooms: 3,
    garages: 2,
    year_built: 2020,
    area: 3200,
    address: "123 Garden Lane",
    latitude: 34.0736,
    longitude: -118.4004,
    propertyType: { id: 1, name: "Villa" },
    propertyStatus: { id: 1, name: "For Sale" },
    city: { id: 1, name: "Beverly Hills" },
    published_status: "published",
    featured_image: "/images/featured/1.jpg",
  },
  {
    id: 2,
    title: "Luxury Office Space",
    description: "Premium office space in downtown",
    price: 1200000,
    property_type_id: 2,
    property_status_id: 1,
    city_id: 2,
    bedrooms: 0,
    bathrooms: 2,
    garages: 0,
    year_built: 2022,
    area: 2500,
    address: "456 Business Ave",
    latitude: 40.7128,
    longitude: -74.006,
    propertyType: { id: 2, name: "Office" },
    propertyStatus: { id: 1, name: "For Sale" },
    city: { id: 2, name: "Manhattan" },
    published_status: "published",
    imageUrl: "/images/featured/2.jpg",
    featured_image: "/images/featured/2.jpg",
    images: ["/images/featured/2.jpg"],
    amenities: [
      { id: "3", name: "Parking", icon: "parking", category: "Exterior" },
      { id: "4", name: "Security", icon: "security", category: "Security" },
    ],
    is_favorited: false,
    created_at: "2024-01-02",
    updated_at: "2024-01-02",
    agent: {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "123-456-7891",
      avatar: "/images/agents/2.jpg",
      experience: 12,
      properties: 156,
      rating: 4.8,
      specialization: "Commercial Properties",
      languages: ["English", "Mandarin"],
      about: "Expert in commercial real estate",
    },
  },
  {
    id: 3,
    title: "Waterfront Apartment",
    description: "Stunning apartment with ocean views",
    price: 750000,
    property_type_id: 3,
    property_status_id: 1,
    city_id: 3,
    bedrooms: 2,
    bathrooms: 2,
    garages: 1,
    year_built: 2018,
    area: 1500,
    address: "789 Ocean Drive",
    latitude: 25.7617,
    longitude: -80.1918,
    propertyType: { id: 3, name: "Apartment" },
    propertyStatus: { id: 1, name: "For Sale" },
    city: { id: 3, name: "Miami" },
    published_status: "published",
    imageUrl: "/images/featured/3.jpg",
    featured_image: "/images/featured/3.jpg",
    images: ["/images/featured/3.jpg"],
    amenities: [
      { id: "5", name: "Beach Access", icon: "beach", category: "Exterior" },
      { id: "6", name: "Gym", icon: "gym", category: "Interior" },
    ],
    is_favorited: false,
    created_at: "2024-01-03",
    updated_at: "2024-01-03",
    agent: {
      id: "3",
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "123-456-7892",
      avatar: "/images/agents/3.jpg",
      experience: 5,
      properties: 98,
      rating: 4.7,
      specialization: "Residential Properties",
      languages: ["English", "Spanish"],
      about: "Residential property specialist",
    },
  },
];

export default function FeaturedProperties() {
  return (
    <SectionWrapper>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">Featured Properties</h2>
          <p className="text-muted-foreground mt-2">
            Explore our handpicked selection of premium properties
          </p>
        </div>
        <Button variant="ghost" className="hidden sm:flex items-center gap-2">
          View All Properties
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            href={`/properties/${property.id}`}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
