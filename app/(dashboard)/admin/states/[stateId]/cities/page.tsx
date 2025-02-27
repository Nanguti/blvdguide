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
import { CityDialog } from "./components/city-dialog";
import { Pencil, Trash, ArrowLeft, MapPin } from "lucide-react";
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

interface City {
  id: number;
  name: string;
  state_id: number;
}

interface State {
  id: number;
  name: string;
}

interface ErrorResponse {
  message: string;
}

export default function CitiesPage() {
  const params = useParams();
  const stateId = params.stateId as string;
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const queryClient = useQueryClient();

  const { data: state } = useQuery<State>({
    queryKey: ["state", stateId],
    queryFn: async () => {
      const response = await api.get(`/states/${stateId}/cities`);
      return response.data;
    },
  });

  const { data: cities, isLoading } = useQuery<City[]>({
    queryKey: ["cities", stateId],
    queryFn: async () => {
      const response = await api.get(`/states/${stateId}/cities`);
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/states/${stateId}/cities/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities", stateId] });
      toast.success("City deleted successfully");
      setOpenAlert(false);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete city";
      toast.error(errorMessage);
    },
  });

  const handleEdit = (city: City) => {
    setSelectedCity(city);
    setOpen(true);
  };

  const handleDelete = (city: City) => {
    setSelectedCity(city);
    setOpenAlert(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/states">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Cities in {state?.name}</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">Manage cities in {state?.name}</p>
        <Button onClick={() => setOpen(true)}>Add New City</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cities?.map((city) => (
            <TableRow key={city.id}>
              <TableCell>{city.name}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(city)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(city)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <Link href={`/admin/cities/${city.id}/areas`}>
                    <MapPin className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CityDialog
        open={open}
        setOpen={setOpen}
        city={selectedCity}
        stateId={parseInt(stateId)}
        onClose={() => setSelectedCity(null)}
      />

      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              city and all its associated areas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selectedCity && deleteMutation.mutate(selectedCity.id)
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
