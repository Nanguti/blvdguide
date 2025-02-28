"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import SubscriptionPlanModal from "./components/SubscriptionPlanModal";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./components/columns";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/services/api";

export default function SubscriptionPlansPage() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: subscriptionPlans = [], refetch } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const response = await api.get("/subscription-plans");
      return response.data;
    },
  });

  const onDelete = async (id: string) => {
    try {
      setLoading(true);
      await api.delete(`/subscription-plans/${id}`);
      await refetch();
      toast.success("Subscription plan deleted successfully");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Subscription Plans (${subscriptionPlans.length})`}
          description="Manage subscription plans for your platform"
        />
        <Button
          onClick={() => setOpen(true)}
          className="font-['Roboto_Slab'] font-semibold"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        columns={columns}
        data={subscriptionPlans}
        searchKey="name"
        loading={loading}
        onDelete={onDelete}
      />
      <SubscriptionPlanModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={refetch}
      />
    </>
  );
}
