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

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ErrorResponse {
  message: string;
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
});

type CategoryDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  category?: Category | null;
  onClose: () => void;
};

export function CategoryDialog({
  open,
  setOpen,
  category,
  onClose,
}: CategoryDialogProps) {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await api.post("/categories", values);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully");
      handleClose();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create category";
      toast.error(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!category) throw new Error("Category not found");
      const response = await api.put(`/categories/${category.id}`, values);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated successfully");
      handleClose();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update category";
      toast.error(errorMessage);
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        slug: category.slug,
      });
    } else {
      form.reset({
        name: "",
        slug: "",
      });
    }
  }, [category, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (category) {
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

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "name") {
        const nameValue = value.name;
        if (nameValue) {
          form.setValue("slug", nameValue.toLowerCase().replace(/\s+/g, "-"));
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Create Category"}
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
                    <Input placeholder="Enter category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category slug" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">{category ? "Update" : "Create"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
