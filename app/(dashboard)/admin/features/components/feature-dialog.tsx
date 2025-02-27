"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { toast } from "react-hot-toast";
import api from "@/lib/services/api";
import { AxiosError } from "axios";

const featureSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type FeatureFormValues = z.infer<typeof featureSchema>;

interface Feature {
  id: number;
  name: string;
}

interface FeatureDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  feature: Feature | null;
  onClose: () => void;
}

interface ErrorResponse {
  message: string;
}

export function FeatureDialog({
  open,
  setOpen,
  feature,
  onClose,
}: FeatureDialogProps) {
  const queryClient = useQueryClient();
  const form = useForm<FeatureFormValues>({
    resolver: zodResolver(featureSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (feature) {
      form.reset({
        name: feature.name,
      });
    } else {
      form.reset({
        name: "",
      });
    }
  }, [feature, form]);

  const createMutation = useMutation({
    mutationFn: async (values: FeatureFormValues) => {
      const response = await api.post("/features", values);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
      toast.success("Feature created successfully");
      handleClose();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create feature";
      toast.error(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: FeatureFormValues) => {
      const response = await api.put(`/features/${feature?.id}`, values);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
      toast.success("Feature updated successfully");
      handleClose();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update feature";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (values: FeatureFormValues) => {
    if (feature) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {feature ? "Edit Feature" : "Create New Feature"}
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">{feature ? "Update" : "Create"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
