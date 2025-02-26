import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import api from "@/lib/services/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  countryId: z.string().min(1, "Country is required"),
  stateId: z.string().min(1, "State is required"),
  cityId: z.string().min(1, "City is required"),
});

type AreaDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  area?: any;
  onClose: () => void;
};

export function AreaDialog({ open, setOpen, area, onClose }: AreaDialogProps) {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      countryId: "",
      stateId: "",
      cityId: "",
    },
  });

  const { data: countries } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const response = await api.get("/countries");
      return response.data;
    },
  });

  const { data: states } = useQuery({
    queryKey: ["states", form.watch("countryId")],
    queryFn: async () => {
      const countryId = form.watch("countryId");
      if (!countryId) return [];
      const response = await api.get(`/countries/${countryId}/states`);
      return response.data;
    },
    enabled: !!form.watch("countryId"),
  });

  const { data: cities } = useQuery({
    queryKey: ["cities", form.watch("stateId")],
    queryFn: async () => {
      const stateId = form.watch("stateId");
      if (!stateId) return [];
      const response = await api.get(`/states/${stateId}/cities`);
      return response.data;
    },
    enabled: !!form.watch("stateId"),
  });

  const createMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await api.post(`/cities/${values.cityId}/areas`, {
        name: values.name,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      toast.success("Area created successfully");
      handleClose();
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create area";
      toast.error(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await api.put(
        `/cities/${values.cityId}/areas/${area.id}`,
        {
          name: values.name,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      toast.success("Area updated successfully");
      handleClose();
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update area";
      toast.error(errorMessage);
    },
  });

  useEffect(() => {
    if (area) {
      form.reset({
        name: area.name,
        countryId: area.country.id.toString(),
        stateId: area.state.id.toString(),
        cityId: area.city.id.toString(),
      });
    } else {
      form.reset({
        name: "",
        countryId: "",
        stateId: "",
        cityId: "",
      });
    }
  }, [area, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (area) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  const handleClose = () => {
    setOpen(false);
    onClose();
    form.reset();
  };

  // Reset stateId and cityId when country changes
  useEffect(() => {
    form.setValue("stateId", "");
    form.setValue("cityId", "");
  }, [form.watch("countryId")]);

  // Reset cityId when state changes
  useEffect(() => {
    form.setValue("cityId", "");
  }, [form.watch("stateId")]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{area ? "Edit Area" : "Create Area"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="countryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries?.map((country: any) => (
                        <SelectItem
                          key={country.id}
                          value={country.id.toString()}
                        >
                          {country.name}
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
              name="stateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!form.watch("countryId")}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {states?.map((state: any) => (
                        <SelectItem key={state.id} value={state.id.toString()}>
                          {state.name}
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
              name="cityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!form.watch("stateId")}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cities?.map((city: any) => (
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter area name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">{area ? "Update" : "Create"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
