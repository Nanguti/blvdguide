"use client";

import { use, useState } from "react";
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
import { FloorPlanDialog } from "./components/floor-plan-dialog";
import { Pencil, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import api from "@/lib/services/api";
import { AxiosError } from "axios";

interface FloorPlan {
  id: number;
  title: string;
  size: string;
  rooms: string;
  bathrooms: string;
  price: string;
}

interface ErrorResponse {
  message: string;
}

type Props = {
  params: Promise<{ propertyId: string }>;
};

export default function FloorPlansPage({ params }: Props) {
  const id = use(params);
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedFloorPlan, setSelectedFloorPlan] = useState<FloorPlan | null>(
    null
  );
  const queryClient = useQueryClient();
  const propertyId = id.propertyId;

  const { data: floorPlans, isLoading } = useQuery<FloorPlan[]>({
    queryKey: ["floorPlans", propertyId],
    queryFn: async () => {
      const response = await api.get(`/properties/${propertyId}/floor-plans`);
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(
        `/properties/${propertyId}/floor-plans/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floorPlans", propertyId] });
      toast.success("Floor plan deleted successfully");
      setOpenAlert(false);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete floor plan";
      toast.error(errorMessage);
    },
  });

  const handleEdit = (floorPlan: FloorPlan) => {
    setSelectedFloorPlan(floorPlan);
    setOpen(true);
  };

  const handleDelete = (floorPlan: FloorPlan) => {
    setSelectedFloorPlan(floorPlan);
    setOpenAlert(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Floor Plans Management</h1>
        <Button onClick={() => setOpen(true)}>Add New Floor Plan</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Rooms</TableHead>
            <TableHead>Bathrooms</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {floorPlans?.map((floorPlan) => (
            <TableRow key={floorPlan.id}>
              <TableCell>{floorPlan.id}</TableCell>
              <TableCell>{floorPlan.title}</TableCell>
              <TableCell>{floorPlan.size}</TableCell>
              <TableCell>{floorPlan.rooms}</TableCell>
              <TableCell>{floorPlan.bathrooms}</TableCell>
              <TableCell>{floorPlan.price}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(floorPlan)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(floorPlan)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <FloorPlanDialog
        open={open}
        setOpen={setOpen}
        floorPlan={selectedFloorPlan}
        propertyId={propertyId}
        onClose={() => setSelectedFloorPlan(null)}
      />

      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              floor plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selectedFloorPlan && deleteMutation.mutate(selectedFloorPlan.id)
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
