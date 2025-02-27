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
import { ErrorResponse } from "../../types";

interface FloorPlan {
  id: number;
  title: string;
  description: string;
  image: string;
  price: string;
  size: string;
}

interface FloorPlanListProps {
  propertyId: string;
}

export function FloorPlanList({ propertyId }: FloorPlanListProps) {
  const queryClient = useQueryClient();

  const { data: floorPlans, isLoading } = useQuery<FloorPlan[]>({
    queryKey: ["floorPlans", propertyId],
    queryFn: async () => {
      const response = await api.get(`/properties/${propertyId}/floor-plans`);
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (floorPlanId: number) => {
      const response = await api.delete(
        `/properties/${propertyId}/floor-plans/${floorPlanId}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floorPlans", propertyId] });
      toast.success("Floor plan deleted successfully");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete floor plan";
      toast.error(errorMessage);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {floorPlans?.map((floorPlan) => (
        <Card key={floorPlan.id}>
          <CardHeader>
            {floorPlan.image && (
              <img
                src={`/storage/${floorPlan.image}`}
                alt={floorPlan.title}
                className="w-full h-48 object-contain rounded-t-lg"
              />
            )}
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold text-lg">{floorPlan.title}</h3>
            {floorPlan.description && (
              <p className="text-sm text-gray-500 mt-1">
                {floorPlan.description}
              </p>
            )}
            <div className="mt-2 space-y-1">
              {floorPlan.size && (
                <p className="text-sm">
                  <span className="font-medium">Size:</span> {floorPlan.size}{" "}
                  sqft
                </p>
              )}
              {floorPlan.price && (
                <p className="text-sm">
                  <span className="font-medium">Price:</span> ${floorPlan.price}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
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
                    the floor plan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteMutation.mutate(floorPlan.id)}
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
