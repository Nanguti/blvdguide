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
import { PropertyStatusDialog } from "./components/property-status-dialog";
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

interface PropertyStatus {
  id: number;
  name: string;
}

interface ErrorResponse {
  message: string;
}

export default function PropertyStatusesPage() {
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedPropertyStatus, setSelectedPropertyStatus] =
    useState<PropertyStatus | null>(null);
  const queryClient = useQueryClient();

  const { data: propertyStatuses, isLoading } = useQuery<PropertyStatus[]>({
    queryKey: ["propertyStatuses"],
    queryFn: async () => {
      const response = await api.get("/property-statuses");
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/property-statuses/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["propertyStatuses"] });
      toast.success("Property status deleted successfully");
      setOpenAlert(false);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete property status";
      toast.error(errorMessage);
    },
  });

  const handleEdit = (propertyStatus: PropertyStatus) => {
    setSelectedPropertyStatus(propertyStatus);
    setOpen(true);
  };

  const handleDelete = (propertyStatus: PropertyStatus) => {
    setSelectedPropertyStatus(propertyStatus);
    setOpenAlert(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Property Statuses</h1>
        <Button onClick={() => setOpen(true)}>Add New Property Status</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {propertyStatuses?.map((propertyStatus) => (
            <TableRow key={propertyStatus.id}>
              <TableCell>{propertyStatus.name}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(propertyStatus)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(propertyStatus)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PropertyStatusDialog
        open={open}
        setOpen={setOpen}
        propertyStatus={selectedPropertyStatus}
        onClose={() => setSelectedPropertyStatus(null)}
      />

      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              property status.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selectedPropertyStatus &&
                deleteMutation.mutate(selectedPropertyStatus.id)
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
