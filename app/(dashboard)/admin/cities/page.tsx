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

export default function CitiesPage() {
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const queryClient = useQueryClient();

  // First fetch all countries
  const { data: countries } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const response = await api.get("/countries");
      return response.data;
    },
  });

  // Then fetch states for all countries
  const { data: states } = useQuery({
    queryKey: ["states", countries],
    queryFn: async () => {
      if (!countries) return [];

      const statesPromises = countries.map(async (country: any) => {
        const response = await api.get(`/countries/${country.id}/states`);
        return response.data.map((state: any) => ({
          ...state,
          country: country,
        }));
      });

      const statesArrays = await Promise.all(statesPromises);
      return statesArrays.flat();
    },
    enabled: !!countries,
  });

  // Finally fetch cities for all states
  const { data: cities, isLoading } = useQuery({
    queryKey: ["cities", states],
    queryFn: async () => {
      if (!states) return [];

      const citiesPromises = states.map(async (state: any) => {
        const response = await api.get(`/states/${state.id}/cities`);
        return response.data.map((city: any) => ({
          ...city,
          state: state,
          country: state.country,
        }));
      });

      const citiesArrays = await Promise.all(citiesPromises);
      return citiesArrays.flat();
    },
    enabled: !!states,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      if (!cities) throw new Error("Cities not loaded");
      const city = cities.find((c: any) => c.id === id);
      if (!city) throw new Error("City not found");
      const response = await api.delete(
        `/states/${city.state.id}/cities/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cities"] });
      toast.success("City deleted successfully");
      setOpenAlert(false);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete city";
      toast.error(errorMessage);
    },
  });

  const handleEdit = (city: any) => {
    setSelectedCity(city);
    setOpen(true);
  };

  const handleDelete = (city: any) => {
    setSelectedCity(city);
    setOpenAlert(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cities Management</h1>
        <Button onClick={() => setOpen(true)}>Add New City</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cities?.map((city: any) => (
            <TableRow key={city.id}>
              <TableCell>{city.id}</TableCell>
              <TableCell>{city.name}</TableCell>
              <TableCell>{city.state?.name}</TableCell>
              <TableCell>{city.country?.name}</TableCell>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CityDialog
        open={open}
        setOpen={setOpen}
        city={selectedCity}
        onClose={() => setSelectedCity(null)}
      />

      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              city.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(selectedCity.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
