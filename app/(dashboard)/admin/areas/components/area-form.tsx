"use client";

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

const areaSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  cityId: z.string().min(1, "City is required"),
});

type AreaFormData = z.infer<typeof areaSchema>;

interface AreaFormProps {
  initialData?: AreaFormData & { id?: number };
  mode: "create" | "edit";
}

interface City {
  id: number;
  name: string;
}

export default function AreaForm({ initialData, mode }: AreaFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: cities } = useQuery<City[]>({
    queryKey: ["cities"],
    queryFn: async () => {
      const response = await axios.get("/api/cities");
      return response.data;
    },
  });

  const form = useForm<AreaFormData>({
    resolver: zodResolver(areaSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      cityId: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: AreaFormData) => {
      if (mode === "create") {
        return axios.post("/api/areas", data);
      } else {
        return axios.put(`/api/areas/${initialData?.id}`, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      toast.success(mode === "create" ? "Area created" : "Area updated");
      router.push("/areas");
    },
    onError: () => {
      toast.error(
        mode === "create" ? "Failed to create area" : "Failed to update area"
      );
    },
  });

  const onSubmit = (data: AreaFormData) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Area name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cities?.map((city) => (
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Area description"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={mutation.isPending}>
            {mode === "create" ? "Create Area" : "Update Area"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/areas")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
