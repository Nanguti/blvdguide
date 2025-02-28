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

interface Schedule {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  message: string;
  property: {
    id: number;
    title: string;
  };
  status: "pending" | "confirmed" | "cancelled" | "completed";
  created_at: string;
}

export default function SchedulesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("all");
  const perPage = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["schedules", page, search, status],
    queryFn: async () => {
      const response = await api.get("/schedules", {
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
        <h1 className="text-2xl font-bold">Property Viewing Schedules</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Search schedules..."
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Viewing Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No schedules found
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((schedule: Schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>
                    {format(new Date(schedule.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{schedule.name}</TableCell>
                  <TableCell>{schedule.property.title}</TableCell>
                  <TableCell>
                    <div>
                      <div>{schedule.email}</div>
                      <div className="text-sm text-muted-foreground">
                        {schedule.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>
                        {format(new Date(schedule.date), "MMM d, yyyy")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {schedule.time}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs capitalize ${
                        schedule.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : schedule.status === "confirmed"
                          ? "bg-blue-100 text-blue-800"
                          : schedule.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {schedule.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {data?.total > perPage && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * perPage + 1} to{" "}
            {Math.min(page * perPage, data.total)} of {data.total} entries
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded border disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <button
              className="px-3 py-1 rounded border disabled:opacity-50"
              disabled={page * perPage >= data.total}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
