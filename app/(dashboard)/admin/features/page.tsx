"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "react-hot-toast";
import { FeatureDialog } from "./components/feature-dialog";
import api from "@/lib/services/api";
import { AxiosError } from "axios";

interface Feature {
  id: number;
  name: string;
}

interface ErrorResponse {
  message: string;
}

export default function FeaturesPage() {
  const [open, setOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const queryClient = useQueryClient();

  const { data: features, isLoading } = useQuery<Feature[]>({
    queryKey: ["features"],
    queryFn: async () => {
      const response = await api.get("/features");
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/features/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
      toast.success("Feature deleted successfully");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete feature";
      toast.error(errorMessage);
    },
  });

  const handleEdit = (feature: Feature) => {
    setSelectedFeature(feature);
    setOpen(true);
  };

  const handleDelete = (feature: Feature) => {
    if (window.confirm("Are you sure you want to delete this feature?")) {
      deleteMutation.mutate(feature.id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Features</h1>
        <Button onClick={() => setOpen(true)}>Add New Feature</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {features?.map((feature) => (
            <TableRow key={feature.id}>
              <TableCell>{feature.name}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(feature)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(feature)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <FeatureDialog
        open={open}
        setOpen={setOpen}
        feature={selectedFeature}
        onClose={() => setSelectedFeature(null)}
      />
    </div>
  );
}
