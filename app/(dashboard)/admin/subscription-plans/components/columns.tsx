"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

export type SubscriptionPlanColumn = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  duration_in_days: number;
  property_limit: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export const columns: ColumnDef<SubscriptionPlanColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => formatPrice(row.original.price),
  },
  {
    accessorKey: "duration_in_days",
    header: "Duration (Days)",
  },
  {
    accessorKey: "property_limit",
    header: "Property Limit",
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.is_active ? "default" : "destructive"}>
        {row.original.is_active ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
