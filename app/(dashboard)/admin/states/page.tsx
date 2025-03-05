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
import { StateDialog } from "./components/state-dialog";
import { Pencil, Trash, MapPin } from "lucide-react";
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
import Loading from "@/components/Loading";

interface Country {
  id: number;
  name: string;
}

interface State {
  id: number;
  name: string;
  code: string;
  country_id: number;
  country: Country;
}

interface ErrorResponse {
  message: string;
}

export default function StatesPage() {
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const queryClient = useQueryClient();

  // First, fetch all countries
  const { data: countries } = useQuery<Country[]>({
    queryKey: ["countries"],
    queryFn: async () => {
      const response = await api.get("/countries");
      return response.data;
    },
  });

  // Then fetch states for each country
  const { data: states, isLoading } = useQuery<State[]>({
    queryKey: ["states", countries],
    queryFn: async () => {
      if (!countries) return [];

      const statesPromises = countries.map(async (country) => {
        const response = await api.get(`/countries/${country.id}/states`);
        return response.data.map((state: Omit<State, "country">) => ({
          ...state,
          country,
        }));
      });

      const statesArrays = await Promise.all(statesPromises);
      return statesArrays.flat();
    },
    enabled: !!countries,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      if (!states) throw new Error("States not loaded");
      const state = states.find((s) => s.id === id);
      if (!state) throw new Error("State not found");

      const response = await api.delete(
        `/countries/${state.country.id}/states/${id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["states"] });
      toast.success("State deleted successfully");
      setOpenAlert(false);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete state";
      toast.error(errorMessage);
    },
  });

  const handleEdit = (state: State) => {
    setSelectedState(state);
    setOpen(true);
  };

  const handleDelete = (state: State) => {
    setSelectedState(state);
    setOpenAlert(true);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">States</h1>
        <Button onClick={() => setOpen(true)}>Add New State</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {states?.map((state) => (
            <TableRow key={state.id}>
              <TableCell>{state.name}</TableCell>
              <TableCell>{state.code}</TableCell>
              <TableCell>{state.country.name}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(state)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(state)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <Link href={`/admin/states/${state.id}/cities`}>
                    <MapPin className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <StateDialog
        open={open}
        setOpen={setOpen}
        state={selectedState}
        onClose={() => setSelectedState(null)}
      />

      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              state and all its associated cities.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selectedState && deleteMutation.mutate(selectedState.id)
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
