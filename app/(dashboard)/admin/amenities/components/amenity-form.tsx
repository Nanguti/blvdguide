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
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import api from "@/lib/services/api";

const amenitySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type AmenityFormData = z.infer<typeof amenitySchema>;

interface AmenityFormProps {
  initialData?: AmenityFormData & { id?: number; icon?: string };
  mode: "create" | "edit";
}

export default function AmenityForm({ initialData, mode }: AmenityFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [icon, setIcon] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>(
    initialData?.icon || ""
  );

  const form = useForm<AmenityFormData>({
    resolver: zodResolver(amenitySchema),
    defaultValues: initialData || {
      name: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (mode === "create") {
        return api.post("/amenities", data);
      } else {
        return api.put(`/amenities/${initialData?.id}`, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["amenities"] });
      toast.success(mode === "create" ? "Amenity created" : "Amenity updated");
      router.push("/admin/amenities");
    },
    onError: () => {
      toast.error(
        mode === "create"
          ? "Failed to create amenity"
          : "Failed to update amenity"
      );
    },
  });

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIcon(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: AmenityFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (icon) {
      formData.append("icon", icon);
    }
    mutation.mutate(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Amenity name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Icon</FormLabel>
            <div className="mt-2 flex items-center gap-4">
              {iconPreview && (
                <Image
                  src={iconPreview}
                  alt="Icon preview"
                  width={48}
                  height={48}
                  className="rounded"
                />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleIconChange}
                className="max-w-[300px]"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={mutation.isPending}>
            {mode === "create" ? "Create Amenity" : "Update Amenity"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/amenities")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
