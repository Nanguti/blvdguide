"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import api from "@/lib/services/api";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ErrorResponse, PropertyMedia } from "../../types";

interface MediaGalleryProps {
  propertyId: string;
}

export function MediaGallery({ propertyId }: MediaGalleryProps) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL;
  const queryClient = useQueryClient();

  const { data: mediaItems, isLoading } = useQuery<PropertyMedia[]>({
    queryKey: ["propertyMedia", propertyId],
    queryFn: async () => {
      const response = await api.get(`/properties/${propertyId}/media`);
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (mediaId: number) => {
      const response = await api.delete(
        `/properties/${propertyId}/media/${mediaId}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["propertyMedia", propertyId],
      });
      toast.success("Media deleted successfully");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete media";
      toast.error(errorMessage);
    },
  });

  const setFeaturedMutation = useMutation({
    mutationFn: async (mediaId: number) => {
      const response = await api.put(
        `/properties/${propertyId}/media/${mediaId}`,
        { is_featured: true }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["propertyMedia", propertyId],
      });
      toast.success("Featured media updated successfully");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update featured media";
      toast.error(errorMessage);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {mediaItems?.map((media) => (
        <Card key={media.id}>
          <CardHeader>
            {media.type === "image" ? (
              <img
                src={`${mediaUrl}/${media.url}`}
                alt="Property media"
                className="w-full h-48 object-cover rounded-t-lg"
              />
            ) : (
              <video
                src={`${mediaUrl}/${media.url}`}
                className="w-full h-48 object-cover rounded-t-lg"
                controls
              />
            )}
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 capitalize">
              Type: {media.type}
            </p>
            {media.is_featured && (
              <span className="text-sm text-green-500">Featured</span>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFeaturedMutation.mutate(media.id)}
              disabled={media.is_featured}
            >
              Set as Featured
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the media from the property.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteMutation.mutate(media.id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
