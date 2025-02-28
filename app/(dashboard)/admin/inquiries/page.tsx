"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import api from "@/lib/services/api";
import { format } from "date-fns";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
}

interface Property {
  id: number;
  title: string;
}

interface Inquiry {
  id: number;
  property_id: number;
  user_id: number;
  message: string;
  status: "new" | "replied";
  created_at: string;
  updated_at: string;
  user: User;
  property: Property;
}

interface PaginatedResponse {
  current_page: number;
  data: Inquiry[];
  total: number;
  per_page: number;
}

export default function InquiriesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("all");
  const perPage = 10;

  const { data, isLoading } = useQuery<PaginatedResponse>({
    queryKey: ["inquiries", page, search, status],
    queryFn: async () => {
      const response = await api.get("/inquiries", {
        params: {
          page,
          search,
          status: status !== "all" ? status : undefined,
          per_page: perPage,
        },
      });
      return response.data;
    },
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Inquiries</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Search inquiries..."
            value={search}
            onChange={handleSearch}
            className="w-64"
          />
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No inquiries found
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell>
                    {format(new Date(inquiry.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{inquiry.user.name}</TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/properties/${inquiry.property_id}`}
                      className="text-primary hover:underline"
                    >
                      {inquiry.property.title}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-md truncate">
                    {inquiry.message}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{inquiry.user.email}</div>
                      {inquiry.user.phone && (
                        <div className="text-sm text-muted-foreground">
                          {inquiry.user.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs capitalize ${
                        inquiry.status === "new"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {inquiry.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {format(new Date(inquiry.updated_at), "MMM d, yyyy")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {data && data.total > perPage && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {(data.current_page - 1) * perPage + 1} to{" "}
            {Math.min(data.current_page * perPage, data.total)} of {data.total}{" "}
            entries
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded border disabled:opacity-50"
              disabled={data.current_page === 1}
              onClick={() => setPage(data.current_page - 1)}
            >
              Previous
            </button>
            <button
              className="px-3 py-1 rounded border disabled:opacity-50"
              disabled={data.current_page * perPage >= data.total}
              onClick={() => setPage(data.current_page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
