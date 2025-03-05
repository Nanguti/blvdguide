"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import UserModal from "./components/UserModal";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./components/columns";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/services/api";

export default function UsersPage() {
  const [open, setOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    data: users = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get("/users");
      return response.data.data;
    },
    refetchOnWindowFocus: true,
  });

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await api.delete(`/users/${id}`);
      await refetch();
      toast.success("User deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Users (${users.length})`}
          description="Manage users of your platform"
        />
        <Button
          onClick={() => setOpen(true)}
          className="font-['Roboto_Slab'] font-semibold"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        columns={columns({
          onDelete,
          deletingId,
        })}
        data={users}
        searchKey="email"
        loading={isLoading}
      />
      <UserModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={refetch}
      />
    </>
  );
}
