"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

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
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import api from "@/lib/services/api";

const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    current_password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
    new_password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
    confirm_password: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.new_password && !data.current_password) {
        return false;
      }
      return true;
    },
    {
      message: "Current password is required when setting a new password",
      path: ["current_password"],
    }
  )
  .refine(
    (data) => {
      if (data.new_password !== data.confirm_password) {
        return false;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirm_password"],
    }
  );

interface User {
  id: string | number;
  name: string;
  email: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

type ProfileFormValues = z.infer<typeof formSchema>;

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/users");
        const userData = response.data;
        setUser(userData);
        form.reset({
          name: userData.name,
          email: userData.email,
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, [form]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setLoading(true);
      const updateData = {
        name: values.name,
        email: values.email,
        ...(values.new_password
          ? {
              current_password: values.current_password,
              password: values.new_password,
              password_confirmation: values.confirm_password,
            }
          : {}),
      };

      await api.patch(`/users/${user?.id}`, updateData);
      toast.success("Profile updated successfully");

      // Update stored user name
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...storedUser, name: values.name })
      );

      // Reset password fields
      form.reset({
        name: values.name,
        email: values.email,
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error: unknown) {
      console.error("Failed to update profile:", error);
      const apiError = error as ApiError;
      toast.error(
        apiError.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading
          title="Profile Settings"
          description="Manage your account settings"
        />
        <Separator />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
          >
            <div className="grid grid-cols-1 gap-8 w-full max-w-2xl">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Your name"
                        {...field}
                      />
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
                      <Input
                        disabled={loading}
                        placeholder="Your email"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />
              <div className="space-y-2">
                <h2 className="text-lg font-medium">Change Password</h2>
                <p className="text-sm text-muted-foreground">
                  Update your password here. Leave blank to keep your current
                  password.
                </p>
              </div>

              <FormField
                control={form.control}
                name="current_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Enter current password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Enter new password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Confirm new password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button disabled={loading} type="submit" className="ml-auto">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
