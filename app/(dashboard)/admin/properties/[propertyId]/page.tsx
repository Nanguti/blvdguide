"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/lib/services/api";
import { useParams } from "next/navigation";

interface Media {
  id: number;
  type: string;
  url: string;
  is_featured: boolean;
}

interface FloorPlan {
  id: number;
  title: string;
  description: string;
  image: string;
  price: string;
  size: string;
}

interface Amenity {
  id: number;
  name: string;
  icon: string | null;
  created_at: string;
  updated_at: string;
  pivot: {
    property_id: number;
    amenity_id: number;
  };
}

interface Property {
  id: number;
  title: string;
  description: string;
  type: "sale" | "rent";
  property_type_id: number;
  property_status_id: number;
  price: string;
  area: string;
  bedrooms: number | null;
  bathrooms: number | null;
  garages: number | null;
  year_built: number | null;
  address: string;
  latitude: string | null;
  longitude: string | null;
  features: string[];
  published_status: string;
  city_id: number;
  area_id: number | null;
  featured_image: string | null;
  amenities: Amenity[];
  property_type: {
    id: number;
    name: string;
    slug: string;
  };
  property_status: {
    id: number;
    name: string;
  };
  city: {
    id: number;
    state_id: number;
    name: string;
  };
  media: Media[];
  floor_plans: FloorPlan[];
}

// interface ErrorResponse {
//   message: string;
// }

export default function PropertyDetailsPage() {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL;
  const params = useParams();
  const propertyId = params.propertyId as string;

  const { data: property, isLoading } = useQuery<Property>({
    queryKey: ["property", propertyId],
    queryFn: async () => {
      const response = await api.get(`/properties/${propertyId}`);
      return response.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!property) {
    return <div>Property not found</div>;
  }

  // Debug logs
  console.log("Media URL base:", mediaUrl);
  console.log("Media items:", property.media);
  console.log("Floor plans:", property.floor_plans);

  // URL helper function
  const getFullUrl = (path: string) => {
    if (!path) return "";
    // Ensure proper path separation
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${mediaUrl}/${cleanPath}`;
  };

  const featuredImage = property.media.find((m) => m.is_featured)?.url;
  console.log(featuredImage);

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/properties">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{property.title}</h1>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="floor-plans">Floor Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Property details and specifications
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Price
                </p>
                <p className="text-lg font-semibold">
                  Kes. {parseFloat(property.price).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <p className="text-lg font-semibold">
                  {property.property_status.name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Property Type
                </p>
                <p className="text-lg">{property.property_type.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Published Status
                </p>
                <p className="text-lg capitalize">
                  {property.published_status}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Description
                </p>
                <p className="text-gray-600">{property.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
              <CardDescription>
                Property specifications and amenities
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Area
                </p>
                <p className="text-lg">
                  {property.area} m<sup>2</sup>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Bedrooms
                </p>
                <p className="text-lg">{property.bedrooms || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Bathrooms
                </p>
                <p className="text-lg">{property.bathrooms || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Garages
                </p>
                <p className="text-lg">{property.garages || "N/A"}</p>
              </div>
            </CardContent>
          </Card>

          {property.amenities && property.amenities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
                <CardDescription>Property amenities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {property.amenities.map((amenity: Amenity) => (
                    <div
                      key={amenity.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      {amenity.icon && (
                        <span className="text-muted-foreground">
                          <i className={amenity.icon}></i>
                        </span>
                      )}
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="location" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Location Information</CardTitle>
              <CardDescription>Property location details</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Address
                </p>
                <p className="text-lg">{property.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  City
                </p>
                <p className="text-lg">{property.city.name}</p>
              </div>
              {property.latitude && property.longitude && (
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Coordinates
                  </p>
                  <p className="text-lg">
                    {property.latitude}, {property.longitude}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Images</CardTitle>
              <CardDescription>Images of the property</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {property.media.map((media) => (
                  <div
                    key={media.id}
                    className="relative aspect-video overflow-hidden rounded-lg"
                  >
                    <img
                      src={getFullUrl(media.url)}
                      alt={property.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {media.is_featured && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                        Featured
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="floor-plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Floor Plans</CardTitle>
              <CardDescription>Property floor plans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6">
                {property.floor_plans.map((plan) => (
                  <div key={plan.id} className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{plan.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {plan.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          Size: {plan.size} m<sup>2</sup>
                        </p>
                        <p className="text-sm font-medium">
                          Price: Kes. {parseFloat(plan.price).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-lg">
                      <img
                        src={getFullUrl(plan.image)}
                        alt={plan.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link href={`/admin/properties/${property.id}/floor-plans`}>
                  <Button className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Floor Plan
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
