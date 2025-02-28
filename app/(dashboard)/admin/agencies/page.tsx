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

interface Agency {
  id: number;
  name: string;
  description: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  social_media: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export default function AgenciesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: agencies, isLoading } = useQuery<Agency[]>({
    queryKey: ["agencies"],
    queryFn: async () => {
      const response = await api.get("/agencies");
      return response.data.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/agencies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agencies"] });
      toast.success("Agency deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete agency");
    },
  });

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this agency?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10 px-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Agencies</h1>
        <Button onClick={() => router.push("/admin/agencies/create")}>
          <Plus className="mr-2 h-4 w-4" /> Add Agency
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agencies?.map((agency) => (
              <TableRow key={agency.id}>
                <TableCell>
                  {agency.logo && (
                    <Image
                      src={agency.logo}
                      alt={agency.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                </TableCell>
                <TableCell>{agency.name}</TableCell>
                <TableCell>{agency.email}</TableCell>
                <TableCell>{agency.phone}</TableCell>
                <TableCell>{agency.website}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(`/admin/agencies/${agency.id}/edit`)
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(agency.id)}
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
