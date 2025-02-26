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

interface FloorPlan {
  id: number;
  title: string;
  size: string;
  rooms: string;
  bathrooms: string;
  price: string;
}

interface ErrorResponse {
  message: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  size: z.string().min(1, "Size is required"),
  rooms: z.string().min(1, "Number of rooms is required"),
  bathrooms: z.string().min(1, "Number of bathrooms is required"),
  price: z.string().min(1, "Price is required"),
});

type FloorPlanDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  floorPlan?: FloorPlan | null;
  propertyId: string;
  onClose: () => void;
};

export function FloorPlanDialog({
  open,
  setOpen,
  floorPlan,
  propertyId,
  onClose,
}: FloorPlanDialogProps) {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      size: "",
      rooms: "",
      bathrooms: "",
      price: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await api.post(
        `/properties/${propertyId}/floor-plans`,
        values
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floorPlans", propertyId] });
      toast.success("Floor plan created successfully");
      handleClose();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create floor plan";
      toast.error(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await api.put(
        `/properties/${propertyId}/floor-plans/${floorPlan.id}`,
        values
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floorPlans", propertyId] });
      toast.success("Floor plan updated successfully");
      handleClose();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update floor plan";
      toast.error(errorMessage);
    },
  });

  useEffect(() => {
    if (floorPlan) {
      form.reset({
        title: floorPlan.title,
        size: floorPlan.size,
        rooms: floorPlan.rooms,
        bathrooms: floorPlan.bathrooms,
        price: floorPlan.price,
      });
    } else {
      form.reset({
        title: "",
        size: "",
        rooms: "",
        bathrooms: "",
        price: "",
      });
    }
  }, [floorPlan, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (floorPlan) {
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
            {floorPlan ? "Edit Floor Plan" : "Create Floor Plan"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter floor plan title" {...field} />
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
                    <Input placeholder="Enter size in square feet" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Rooms</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter number of rooms"
                      {...field}
                    />
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
                  <FormLabel>Number of Bathrooms</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter number of bathrooms"
                      {...field}
                    />
                  </FormControl>
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
                    <Input type="number" placeholder="Enter price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">{floorPlan ? "Update" : "Create"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
