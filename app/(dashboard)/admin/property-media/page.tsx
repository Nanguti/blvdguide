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

interface PropertyMedia {
  id: number;
  type: "image" | "video";
  url: string;
  property: {
    id: number;
    title: string;
  };
}

export default function PropertyMediaPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: mediaItems, isLoading } = useQuery<PropertyMedia[]>({
    queryKey: ["property-media"],
    queryFn: async () => {
      const response = await axios.get("/api/property-media");
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/api/property-media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property-media"] });
      toast.success("Media deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete media");
    },
  });

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this media?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Property Media</h1>
        <Button onClick={() => router.push("/property-media/create")}>
          <Plus className="mr-2 h-4 w-4" /> Add Media
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Preview</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mediaItems?.map((media) => (
              <TableRow key={media.id}>
                <TableCell>
                  {media.type === "image" ? (
                    <Image
                      src={media.url}
                      alt={`Media for ${media.property.title}`}
                      width={120}
                      height={80}
                      className="rounded object-cover"
                    />
                  ) : (
                    <video
                      src={media.url}
                      width={120}
                      height={80}
                      className="rounded"
                      controls
                    />
                  )}
                </TableCell>
                <TableCell className="capitalize">{media.type}</TableCell>
                <TableCell>{media.property.title}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(`/property-media/${media.id}/edit`)
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(media.id)}
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
