"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Property } from "@/types/property";
import { propertyService } from "@/lib/services/property";

// Define the form schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  property_type_id: z.string().min(1, "Property type is required"),
  property_status_id: z.string().min(1, "Property status is required"),
  city_id: z.string().min(1, "City is required"),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  garages: z.string().optional(),
  year_built: z.string().optional(),
  area: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  published_status: z.string().min(1, "Published status is required"),
  featured_image: z.instanceof(File).optional(),
});

interface PropertyFormData extends Omit<Property, "id"> {
  featured_image?: File;
}

interface PropertyFormProps {
  property?: Property;
  onSubmit: (data: PropertyFormData) => void;
}

interface SelectOption {
  id: number;
  name: string;
}

// Add this interface for form values
interface FormValues {
  title: string;
  description: string;
  price: string;
  property_type_id: string;
  property_status_id: string;
  city_id: string;
  bedrooms?: string;
  bathrooms?: string;
  garages?: string;
  year_built?: string;
  area?: string;
  address: string;
  latitude?: string;
  longitude?: string;
  published_status: string;
  featured_image?: File;
}

const PropertyForm = ({ property, onSubmit }: PropertyFormProps) => {
  const [loading, setLoading] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState<SelectOption[]>([]);
  const [propertyStatuses, setPropertyStatuses] = useState<SelectOption[]>([]);
  const [cities, setCities] = useState<SelectOption[]>([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: property?.title || "",
      description: property?.description || "",
      price: property?.price?.toString() || "",
      property_type_id: property?.property_type_id?.toString() || "",
      property_status_id: property?.property_status_id?.toString() || "",
      city_id: property?.city_id?.toString() || "",
      bedrooms: property?.bedrooms?.toString() || "",
      bathrooms: property?.bathrooms?.toString() || "",
      garages: property?.garages?.toString() || "",
      year_built: property?.year_built?.toString() || "",
      area: property?.area?.toString() || "",
      address: property?.address || "",
      latitude: property?.latitude?.toString() || "",
      longitude: property?.longitude?.toString() || "",
      published_status: property?.published_status || "draft",
    },
  });

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [typesRes, statusesRes, citiesRes] = await Promise.all([
          propertyService.getPropertyTypes(),
          propertyService.getPropertyStatuses(),
          propertyService.getCities(),
        ]);

        // Direct array responses
        setPropertyTypes(typesRes || []);
        setPropertyStatuses(statusesRes || []);
        setCities(citiesRes || []);
      } catch (error) {
        console.error("Error loading form data:", error);
      }
    };

    loadFormData();
  }, []);

  // Update handleSubmit to convert strings to numbers
  const handleSubmit = async (formData: FormValues) => {
    setLoading(true);
    try {
      const propertyData: PropertyFormData = {
        ...formData,
        price: Number(formData.price),
        property_type_id: Number(formData.property_type_id),
        property_status_id: Number(formData.property_status_id),
        city_id: Number(formData.city_id),
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : null,
        garages: formData.garages ? Number(formData.garages) : null,
        year_built: formData.year_built ? Number(formData.year_built) : null,
        area: formData.area ? Number(formData.area) : null,
        latitude: formData.latitude ? Number(formData.latitude) : null,
        longitude: formData.longitude ? Number(formData.longitude) : null,
      };
      await onSubmit(propertyData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featured_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Featured Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    field.onChange(file);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="property_type_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="property_status_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {propertyStatuses.map((status) => (
                        <SelectItem
                          key={status.id}
                          value={status.id.toString()}
                        >
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bedrooms</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bathrooms</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="garages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Garages</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="published_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Published Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["draft", "published", "archived"].map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area (sq ft)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year_built"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year Built</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id.toString()}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.00000001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.00000001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving..." : "Save Property"}
        </Button>
      </form>
    </Form>
  );
};

export default PropertyForm;
