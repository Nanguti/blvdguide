"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

interface PropertyFloorPlan {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  size: number;
  property: {
    id: number;
    title: string;
  };
}

export default function PropertyFloorPlansPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: floorPlans, isLoading } = useQuery<PropertyFloorPlan[]>({
    queryKey: ["property-floor-plans"],
    queryFn: async () => {
      const response = await axios.get("/api/property-floor-plans");
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/api/property-floor-plans/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property-floor-plans"] });
      toast.success("Floor plan deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete floor plan");
    },
  });

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this floor plan?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Property Floor Plans</h1>
        <Button onClick={() => router.push("/property-floor-plans/create")}>
          <Plus className="mr-2 h-4 w-4" /> Add Floor Plan
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {floorPlans?.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>
                  {plan.image && (
                    <Image
                      src={plan.image}
                      alt={plan.title}
                      width={100}
                      height={60}
                      className="rounded object-cover"
                    />
                  )}
                </TableCell>
                <TableCell>{plan.title}</TableCell>
                <TableCell>{plan.property.title}</TableCell>
                <TableCell>{plan.size} sqft</TableCell>
                <TableCell>${plan.price.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(`/property-floor-plans/${plan.id}/edit`)
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(plan.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
