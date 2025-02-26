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
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import api from "@/lib/services/api";

const agencySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email address"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  logo: z.string().nullable().optional().or(z.literal("")),
  social_media: z
    .object({
      facebook: z
        .string()
        .url("Invalid Facebook URL")
        .optional()
        .or(z.literal("")),
      twitter: z
        .string()
        .url("Invalid Twitter URL")
        .optional()
        .or(z.literal("")),
      instagram: z
        .string()
        .url("Invalid Instagram URL")
        .optional()
        .or(z.literal("")),
      linkedin: z
        .string()
        .url("Invalid LinkedIn URL")
        .optional()
        .or(z.literal("")),
    })
    .optional()
    .default({
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
    }),
});

type AgencyFormData = z.infer<typeof agencySchema>;

interface AgencyFormProps {
  initialData?: AgencyFormData & { id?: number };
  mode: "create" | "edit";
}

export default function AgencyForm({ initialData, mode }: AgencyFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(
    initialData?.logo || ""
  );

  const form = useForm<AgencyFormData>({
    resolver: zodResolver(agencySchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      social_media: {
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: "",
      },
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      try {
        if (mode === "create") {
          const response = await api.post("/agencies", data);
          return response.data;
        } else {
          console.log("Updating agency:", initialData?.id);
          // Convert FormData to URLSearchParams
          const params = new URLSearchParams();
          for (const [key, value] of data.entries()) {
            if (key === "social_media") {
              params.append(key, value.toString());
            } else if (key !== "logo_file") {
              params.append(key, value.toString());
            }
          }

          // Handle file upload separately if needed
          let response;
          if (data.get("logo_file")) {
            // If there's a file, use FormData
            response = await api.put(`/agencies/${initialData?.id}`, data, {
              headers: { "Content-Type": "multipart/form-data" },
            });
          } else {
            // Otherwise use URL parameters
            response = await api.put(
              `/agencies/${initialData?.id}?${params.toString()}`
            );
          }

          console.log("Update response:", response);
          return response.data;
        }
      } catch (error) {
        console.error("API error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Mutation success:", data);
      queryClient.invalidateQueries({ queryKey: ["agencies"] });
      toast.success(mode === "create" ? "Agency created" : "Agency updated");
      router.push("/admin/agencies");
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error(
        mode === "create"
          ? "Failed to create agency"
          : "Failed to update agency"
      );
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: AgencyFormData) => {
    console.log("Form submitted", { mode, data, initialData });
    try {
      const formData = new FormData();

      // Handle basic fields
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("address", data.address);
      formData.append("phone", data.phone);
      formData.append("email", data.email);

      // Handle optional fields
      if (data.website) formData.append("website", data.website);
      if (data.logo !== null && data.logo !== undefined && data.logo !== "") {
        formData.append("logo", data.logo);
      }

      // Handle social media
      if (data.social_media) {
        formData.append("social_media", JSON.stringify(data.social_media));
      }

      // Handle new logo file if exists
      if (logo) {
        formData.append("logo_file", logo);
      }

      console.log("Submitting with FormData", {
        mode,
        id: initialData?.id,
        formDataEntries: Array.from(formData.entries()),
      });

      await mutation.mutateAsync(formData);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An error occurred while submitting the form");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("Form onSubmit triggered");
          console.log("Form state:", form.getValues());
          console.log("Form errors:", form.formState.errors);

          form.handleSubmit((data) => {
            console.log("Form valid, submitting:", data);
            onSubmit(data);
          })(e);
        }}
        className="space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Agency name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="Website URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-2">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Full address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Agency description"
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
            <FormLabel>Logo</FormLabel>
            <div className="mt-2 flex items-center gap-4">
              {logoPreview && (
                <Image
                  src={logoPreview}
                  alt="Logo preview"
                  width={100}
                  height={100}
                  className="rounded-lg object-cover"
                />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="max-w-[300px]"
              />
            </div>
          </div>

          <div className="col-span-2">
            <h3 className="text-lg font-medium mb-4">Social Media Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="social_media.facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <Input placeholder="Facebook URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="social_media.twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter</FormLabel>
                    <FormControl>
                      <Input placeholder="Twitter URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="social_media.instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input placeholder="Instagram URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="social_media.linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input placeholder="LinkedIn URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={mutation.isPending}
            onClick={() => console.log("Submit button clicked")}
          >
            {mode === "create" ? "Create Agency" : "Update Agency"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/agencies")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
