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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import api from "@/lib/services/api";

const formSchema = z.object({
  // Site Information
  site_name: z.string().min(1, "Site name is required"),
  site_title: z.string().min(1, "Site title is required"),
  site_description: z.string(),
  site_logo: z.string().url("Must be a valid URL").optional(),
  site_favicon: z.string().url("Must be a valid URL").optional(),

  // Contact Information
  company_name: z.string().min(1, "Company name is required"),
  contact_email: z.string().email("Invalid email address"),
  contact_phone: z.string().min(1, "Phone number is required"),
  office_address: z.string().min(1, "Office address is required"),

  // Social Media
  facebook_url: z.string().url("Must be a valid URL").optional(),
  twitter_url: z.string().url("Must be a valid URL").optional(),
  instagram_url: z.string().url("Must be a valid URL").optional(),
  linkedin_url: z.string().url("Must be a valid URL").optional(),

  // Real Estate Specific
  currency_symbol: z.string().min(1, "Currency symbol is required"),
  measurement_unit: z.string().min(1, "Measurement unit is required"),
  properties_per_page: z.string().transform((val) => parseInt(val, 10)),
  show_featured_properties: z.boolean(),
  enable_map: z.boolean(),
  default_latitude: z.string().optional(),
  default_longitude: z.string().optional(),

  // SEO Settings
  google_analytics_id: z.string().optional(),
  meta_keywords: z.string(),
  meta_description: z.string(),

  // Email Settings
  smtp_host: z.string().optional(),
  smtp_port: z.string().optional(),
  smtp_username: z.string().optional(),
  smtp_password: z.string().optional(),
  mail_encryption: z.string().optional(),
  mail_from_address: z.string().email("Invalid email address").optional(),
  mail_from_name: z.string().optional(),
});

interface Settings {
  id: string | number;
  [key: string]: any;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

type SettingsFormValues = z.infer<typeof formSchema>;

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      site_name: "",
      site_title: "",
      site_description: "",
      site_logo: "",
      site_favicon: "",
      company_name: "",
      contact_email: "",
      contact_phone: "",
      office_address: "",
      facebook_url: "",
      twitter_url: "",
      instagram_url: "",
      linkedin_url: "",
      currency_symbol: "$",
      measurement_unit: "sq ft",
      properties_per_page: 12,
      show_featured_properties: true,
      enable_map: true,
      default_latitude: "",
      default_longitude: "",
      google_analytics_id: "",
      meta_keywords: "",
      meta_description: "",
      smtp_host: "",
      smtp_port: "",
      smtp_username: "",
      smtp_password: "",
      mail_encryption: "tls",
      mail_from_address: "",
      mail_from_name: "",
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/settings");
        const settingsData = response.data;
        setSettings(settingsData);
        form.reset(settingsData.data);
      } catch (error) {
        toast.error("Failed to load settings");
      }
    };

    fetchSettings();
  }, [form]);

  console.log("Settings here", settings);

  const onSubmit = async (values: SettingsFormValues) => {
    console.log("Form submission started");
    console.log("Form values:", values);
    if (!settings?.data?.id) {
      toast.error("Settings ID not found");
      return;
    }
    try {
      setLoading(true);
      console.log("Sending request to:", `/settings/${settings.data.id}`);
      const response = await api.patch(`/settings/${settings.data.id}`, values);
      console.log("Server response:", response);
      toast.success("Settings updated successfully");
    } catch (error: unknown) {
      console.error("Failed to update settings:", error);
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.message || "Failed to update settings";
      console.error("Error details:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading
          title="Website Settings"
          description="Manage your website settings"
        />
        <Separator />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
            noValidate
          >
            <div className="grid grid-cols-1 gap-8 w-full max-w-2xl">
              {/* Site Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Site Information</h2>
                <FormField
                  control={form.control}
                  name="site_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Your website name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="site_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Title</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Your website title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="site_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Description</FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={loading}
                          placeholder="Brief description of your website"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Contact Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Contact Information</h2>
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Your company name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          type="email"
                          placeholder="contact@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="+1 234 567 8900"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="office_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Office Address</FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={loading}
                          placeholder="Your office address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Real Estate Settings */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Real Estate Settings</h2>
                <FormField
                  control={form.control}
                  name="currency_symbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency Symbol</FormLabel>
                      <FormControl>
                        <Input disabled={loading} placeholder="$" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="measurement_unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Measurement Unit</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="sq ft"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="properties_per_page"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Properties Per Page</FormLabel>
                      <FormControl>
                        <Input disabled={loading} type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="show_featured_properties"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Featured Properties
                        </FormLabel>
                        <FormDescription>
                          Show featured properties on homepage
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={loading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="enable_map"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Maps</FormLabel>
                        <FormDescription>
                          Show property location on map
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={loading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Social Media Links */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Social Media Links</h2>
                <FormField
                  control={form.control}
                  name="facebook_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook URL</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="https://facebook.com/your-page"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="twitter_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter URL</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="https://twitter.com/your-handle"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instagram_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram URL</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="https://instagram.com/your-handle"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="linkedin_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn URL</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="https://linkedin.com/company/your-company"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* SEO Settings */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">SEO Settings</h2>
                <FormField
                  control={form.control}
                  name="meta_keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Keywords</FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={loading}
                          placeholder="real estate, properties, homes for sale"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="meta_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={loading}
                          placeholder="Your website's meta description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="google_analytics_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Google Analytics ID</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="UA-XXXXXXXXX-X"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Email Settings */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Email Settings</h2>
                <FormField
                  control={form.control}
                  name="smtp_host"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Host</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="smtp.example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="smtp_port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Port</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="587"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="smtp_username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Username</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="your-email@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="smtp_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Password</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          type="password"
                          placeholder="Your SMTP password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mail_from_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mail From Address</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          type="email"
                          placeholder="noreply@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mail_from_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mail From Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Your Company Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button
              disabled={loading}
              onClick={async (e) => {
                e.preventDefault();
                console.log("Button clicked");
                const isValid = await form.trigger();
                console.log("Form validation:", isValid);
                if (isValid) {
                  const values = form.getValues();
                  onSubmit(values);
                } else {
                  console.log("Form errors:", form.formState.errors);
                }
              }}
              type="submit"
              className="ml-auto"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
