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
import { toast } from "react-hot-toast";
import api from "@/lib/services/api";
import { AxiosError } from "axios";
import Loading from "@/components/Loading";

interface Amenity {
  id: number;
  name: string;
  icon: string;
}

interface ErrorResponse {
  message: string;
}

export default function AmenitiesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: amenities, isLoading } = useQuery<Amenity[]>({
    queryKey: ["amenities"],
    queryFn: async () => {
      const response = await api.get("/amenities");
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/amenities/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["amenities"] });
      toast.success("Amenity deleted successfully");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete amenity";
      toast.error(errorMessage);
    },
  });

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this amenity?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Amenities</h1>
        <Button onClick={() => router.push("/admin/amenities/create")}>
          <Plus className="mr-2 h-4 w-4" /> Add Amenity
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Icon</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {amenities?.map((amenity) => (
              <TableRow key={amenity.id}>
                <TableCell>
                  {amenity.icon && (
                    <Image
                      src={amenity.icon}
                      alt={amenity.name}
                      width={32}
                      height={32}
                      className="rounded"
                    />
                  )}
                </TableCell>
                <TableCell>{amenity.name}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(`/admin/amenities/${amenity.id}/edit`)
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(amenity.id)}
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
