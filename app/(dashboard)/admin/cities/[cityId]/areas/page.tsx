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
import { AreaDialog } from "./components/area-dialog";
import { Pencil, Trash, ArrowLeft } from "lucide-react";
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
import Link from "next/link";
import { useParams } from "next/navigation";

interface Area {
  id: number;
  name: string;
  city_id: number;
}

interface City {
  id: number;
  name: string;
  state_id: number;
}

interface ErrorResponse {
  message: string;
}

export default function AreasPage() {
  const params = useParams();
  const cityId = params.cityId as string;
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const queryClient = useQueryClient();

  const { data: city } = useQuery<City>({
    queryKey: ["city", cityId],
    queryFn: async () => {
      const response = await api.get(`/cities/${cityId}`);
      return response.data;
    },
  });

  const { data: areas, isLoading } = useQuery<Area[]>({
    queryKey: ["areas", cityId],
    queryFn: async () => {
      const response = await api.get(`/cities/${cityId}/areas`);
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/cities/${cityId}/areas/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas", cityId] });
      toast.success("Area deleted successfully");
      setOpenAlert(false);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete area";
      toast.error(errorMessage);
    },
  });

  const handleEdit = (area: Area) => {
    setSelectedArea(area);
    setOpen(true);
  };

  const handleDelete = (area: Area) => {
    setSelectedArea(area);
    setOpenAlert(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/admin/states/${city?.state_id}/cities`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Areas in {city?.name}</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">Manage areas in {city?.name}</p>
        <Button onClick={() => setOpen(true)}>Add New Area</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {areas?.map((area) => (
            <TableRow key={area.id}>
              <TableCell>{area.name}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(area)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(area)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AreaDialog
        open={open}
        setOpen={setOpen}
        area={selectedArea}
        cityId={parseInt(cityId)}
        onClose={() => setSelectedArea(null)}
      />

      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              area.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selectedArea && deleteMutation.mutate(selectedArea.id)
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
