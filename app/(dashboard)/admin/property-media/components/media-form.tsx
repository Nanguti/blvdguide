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
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";

const mediaSchema = z.object({
  type: z.enum(["image", "video"], {
    required_error: "Media type is required",
  }),
  propertyId: z.string().min(1, "Property is required"),
});

type MediaFormData = z.infer<typeof mediaSchema>;

interface MediaFormProps {
  initialData?: MediaFormData & { id?: number; url?: string };
  mode: "create" | "edit";
}

interface Property {
  id: number;
  title: string;
}

export default function MediaForm({ initialData, mode }: MediaFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(initialData?.url || "");

  const { data: properties } = useQuery<Property[]>({
    queryKey: ["properties"],
    queryFn: async () => {
      const response = await axios.get("/api/properties");
      return response.data;
    },
  });

  const form = useForm<MediaFormData>({
    resolver: zodResolver(mediaSchema),
    defaultValues: initialData || {
      type: "image",
      propertyId: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (mode === "create") {
        return axios.post("/api/property-media", data);
      } else {
        return axios.put(`/api/property-media/${initialData?.id}`, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property-media"] });
      toast.success(mode === "create" ? "Media created" : "Media updated");
      router.push("/property-media");
    },
    onError: () => {
      toast.error(
        mode === "create" ? "Failed to create media" : "Failed to update media"
      );
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileType = selectedFile.type.split("/")[0];
      const currentType = form.getValues("type");

      if (fileType !== currentType) {
        toast.error(`Please select a ${currentType} file`);
        return;
      }

      setFile(selectedFile);
      if (fileType === "image") {
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        setPreview("");
      }
    }
  };

  const onSubmit = (data: MediaFormData) => {
    if (!file && mode === "create") {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (file) {
      formData.append("file", file);
    }
    mutation.mutate(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Media Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select media type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
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

          <div>
            <FormLabel>Media File</FormLabel>
            <div className="mt-2 flex items-center gap-4">
              {preview && form.getValues("type") === "image" && (
                <Image
                  src={preview}
                  alt="Media preview"
                  width={200}
                  height={120}
                  className="rounded object-cover"
                />
              )}
              {preview && form.getValues("type") === "video" && (
                <video
                  src={preview}
                  width={200}
                  height={120}
                  className="rounded"
                  controls
                />
              )}
              <Input
                type="file"
                accept={
                  form.getValues("type") === "image" ? "image/*" : "video/*"
                }
                onChange={handleFileChange}
                className="max-w-[300px]"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={mutation.isPending}>
            {mode === "create" ? "Create Media" : "Update Media"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/property-media")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
