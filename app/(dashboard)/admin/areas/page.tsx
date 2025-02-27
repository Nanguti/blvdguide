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
import { AxiosError } from "axios";

interface Country {
  id: number;
  name: string;
}

interface State {
  id: number;
  name: string;
  countryId: number;
  country: Country;
}

interface City {
  id: number;
  name: string;
  stateId: number;
  state: State;
}

interface Area {
  id: number;
  name: string;
  slug: string;
  cityId: number;
  city: City;
  state: State;
  country: Country;
}

interface ErrorResponse {
  message: string;
}

export default function AreasPage() {
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const queryClient = useQueryClient();

  // const { data: countries } = useQuery<Country[]>({
  //   queryKey: ["countries"],
  //   queryFn: async () => {
  //     const response = await api.get("/countries");
  //     return response.data;
  //   },
  // });

  // const { data: states } = useQuery<State[]>({
  //   queryKey: ["states"],
  //   queryFn: async () => {
  //     const response = await api.get("/states");
  //     return response.data;
  //   },
  // });

  // const { data: cities } = useQuery<City[]>({
  //   queryKey: ["cities"],
  //   queryFn: async () => {
  //     const response = await api.get("/cities");
  //     return response.data;
  //   },
  // });

  const { data: areas, isLoading } = useQuery<Area[]>({
    queryKey: ["areas"],
    queryFn: async () => {
      const response = await api.get("/areas");
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/areas/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Areas Management</h1>
        <Button onClick={() => setOpen(true)}>Add New Area</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>City</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {areas?.map((area) => (
            <TableRow key={area.id}>
              <TableCell>{area.name}</TableCell>
              <TableCell>{area.slug}</TableCell>
              <TableCell>{area.city.name}</TableCell>
              <TableCell>{area.state.name}</TableCell>
              <TableCell>{area.country.name}</TableCell>
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
        cityId={selectedArea?.cityId || 0}
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
