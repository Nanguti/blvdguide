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
import { PropertyTypeDialog } from "./components/property-type-dialog";
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

export default function PropertyTypesPage() {
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: propertyTypes, isLoading } = useQuery({
    queryKey: ["propertyTypes"],
    queryFn: async () => {
      const response = await api.get("/property-types");
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/property-types/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["propertyTypes"] });
      toast.success("Property type deleted successfully");
      setOpenAlert(false);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete property type";
      toast.error(errorMessage);
    },
  });

  const handleEdit = (propertyType: any) => {
    setSelectedPropertyType(propertyType);
    setOpen(true);
  };

  const handleDelete = (propertyType: any) => {
    setSelectedPropertyType(propertyType);
    setOpenAlert(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Property Types Management</h1>
        <Button onClick={() => setOpen(true)}>Add New Property Type</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {propertyTypes?.map((propertyType: any) => (
            <TableRow key={propertyType.id}>
              <TableCell>{propertyType.id}</TableCell>
              <TableCell>{propertyType.name}</TableCell>
              <TableCell>{propertyType.slug}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(propertyType)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(propertyType)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PropertyTypeDialog
        open={open}
        setOpen={setOpen}
        propertyType={selectedPropertyType}
        onClose={() => setSelectedPropertyType(null)}
      />

      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              property type.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(selectedPropertyType.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
