"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";

const floorPlanSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  size: z.string().min(1, "Size is required"),
  propertyId: z.string().min(1, "Property is required"),
});

type FloorPlanFormData = z.infer<typeof floorPlanSchema>;

interface FloorPlanFormProps {
  initialData?: FloorPlanFormData & { id?: number; image?: string };
  mode: "create" | "edit";
}

interface Property {
  id: number;
  title: string;
}

export default function FloorPlanForm({
  initialData,
  mode,
}: FloorPlanFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    initialData?.image || ""
  );

  const { data: properties } = useQuery<Property[]>({
    queryKey: ["properties"],
    queryFn: async () => {
      const response = await axios.get("/api/properties");
      return response.data;
    },
  });

  const form = useForm<FloorPlanFormData>({
    resolver: zodResolver(floorPlanSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      price: "",
      size: "",
      propertyId: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (mode === "create") {
        return axios.post("/api/property-floor-plans", data);
      } else {
        return axios.put(`/api/property-floor-plans/${initialData?.id}`, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property-floor-plans"] });
      toast.success(
        mode === "create" ? "Floor plan created" : "Floor plan updated"
      );
      router.push("/property-floor-plans");
    },
    onError: () => {
      toast.error(
        mode === "create"
          ? "Failed to create floor plan"
          : "Failed to update floor plan"
      );
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data: FloorPlanFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (image) {
      formData.append("image", image);
    }
    mutation.mutate(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Floor plan title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="propertyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a property" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {properties?.map((property) => (
                      <SelectItem
                        key={property.id}
                        value={property.id.toString()}
                      >
                        {property.title}
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
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Floor plan price"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size (sqft)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Floor plan size"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Floor plan description"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-2">
            <FormLabel>Floor Plan Image</FormLabel>
            <div className="mt-2 flex items-center gap-4">
              {imagePreview && (
                <Image
                  src={imagePreview}
                  alt="Floor plan preview"
                  width={200}
                  height={120}
                  className="rounded object-cover"
                />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="max-w-[300px]"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={mutation.isPending}>
            {mode === "create" ? "Create Floor Plan" : "Update Floor Plan"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/property-floor-plans")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
