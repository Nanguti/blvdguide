"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, Plus } from "lucide-react";
import Link from "next/link";
import { Property } from "@/types/property";
import { propertyService } from "@/lib/services/property";
import { formatCurrency } from "@/lib/utils";
import Loading from "@/components/Loading";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await propertyService.getProperties({});
      setProperties(response.data);
    } catch (error) {
      console.error("Error loading properties:", error);
      setError("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      await propertyService.deleteProperty(id);
      setProperties(properties.filter((property) => property.id !== id));
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  if (!properties.length) {
    return (
      <div className="flex flex-col items-center mt-24 px-5 space-y-4">
        <Link href="/admin/properties/add">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Button>
        </Link>
        <div className="text-center text-gray-500">No properties found</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mt-2 px-5">
        <h2 className="text-2xl font-bold">Properties</h2>
        <Link href="/admin/properties/add">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Button>
        </Link>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium">{property.title}</TableCell>
                <TableCell>{property.propertyType?.name}</TableCell>
                <TableCell>{property.propertyStatus?.name}</TableCell>
                <TableCell>{formatCurrency(property.price)}</TableCell>
                <TableCell>{property.address}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/properties/${property.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/properties/edit/${property.id}`}>
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(property.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
