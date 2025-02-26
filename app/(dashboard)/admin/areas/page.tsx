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

export default function AreasPage() {
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedArea, setSelectedArea] = useState<any>(null);
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

  // Then fetch cities for all states
  const { data: cities } = useQuery({
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

  // Finally fetch areas for all cities
  const { data: areas, isLoading } = useQuery({
    queryKey: ["areas", cities],
    queryFn: async () => {
      if (!cities) return [];

      const areasPromises = cities.map(async (city: any) => {
        const response = await api.get(`/cities/${city.id}/areas`);
        return response.data.map((area: any) => ({
          ...area,
          city: city,
          state: city.state,
          country: city.country,
        }));
      });

      const areasArrays = await Promise.all(areasPromises);
      return areasArrays.flat();
    },
    enabled: !!cities,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      if (!areas) throw new Error("Areas not loaded");
      const area = areas.find((a: any) => a.id === id);
      if (!area) throw new Error("Area not found");
      const response = await api.delete(`/cities/${area.city.id}/areas/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      toast.success("Area deleted successfully");
      setOpenAlert(false);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete area";
      toast.error(errorMessage);
    },
  });

  const handleEdit = (area: any) => {
    setSelectedArea(area);
    setOpen(true);
  };

  const handleDelete = (area: any) => {
    setSelectedArea(area);
    setOpenAlert(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Areas Management</h1>
        <Button onClick={() => setOpen(true)}>Add New Area</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>City</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {areas?.map((area: any) => (
            <TableRow key={area.id}>
              <TableCell>{area.id}</TableCell>
              <TableCell>{area.name}</TableCell>
              <TableCell>{area.city?.name}</TableCell>
              <TableCell>{area.state?.name}</TableCell>
              <TableCell>{area.country?.name}</TableCell>
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
              onClick={() => deleteMutation.mutate(selectedArea.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
