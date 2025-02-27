import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import api from "@/lib/services/api";
import { AxiosError } from "axios";
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

interface Country {
  id: number;
  name: string;
  code: string;
  phone_code: string;
  currency: string;
}

interface ErrorResponse {
  message: string;
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().length(2, "Country code must be exactly 2 characters"),
  phone_code: z.string().min(1, "Phone code is required"),
  currency: z.string().length(3, "Currency code must be exactly 3 characters"),
});

type CountryDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  country?: Country | null;
  onClose: () => void;
};

export function CountryDialog({
  open,
  setOpen,
  country,
  onClose,
}: CountryDialogProps) {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      phone_code: "",
      currency: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await api.post("/countries", values);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["countries"] });
      toast.success("Country created successfully");
      handleClose();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create country";
      toast.error(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await api.put(`/countries/${country?.id}`, values);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["countries"] });
      toast.success("Country updated successfully");
      handleClose();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update country";
      toast.error(errorMessage);
    },
  });

  useEffect(() => {
    if (country) {
      form.reset({
        name: country.name,
        code: country.code,
        phone_code: country.phone_code,
        currency: country.currency,
      });
    } else {
      form.reset({
        name: "",
        code: "",
        phone_code: "",
        currency: "",
      });
    }
  }, [country, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (country) {
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {country ? "Edit Country" : "Create Country"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter country name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country Code (ISO)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter country code (e.g., US)"
                      {...field}
                      maxLength={2}
                      style={{ textTransform: "uppercase" }}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter phone code (e.g., +1)"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || value === "+") {
                          field.onChange(value);
                        } else if (value.startsWith("+")) {
                          field.onChange(value);
                        } else {
                          field.onChange("+" + value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter currency code (e.g., USD)"
                      {...field}
                      maxLength={3}
                      style={{ textTransform: "uppercase" }}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">{country ? "Update" : "Create"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
