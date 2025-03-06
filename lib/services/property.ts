import { Property, PropertyFilter } from "@/types/property";
import api from "./api";

// interface PropertyResponse {
//   data: Property[];
//   // Add other response fields if needed
// }

interface SinglePropertyResponse {
  data: Property;
}

export type CreatePropertyData = Omit<Property, "id" | "featured_image"> & {
  featured_image?: File | string | null;
};

export const propertyService = {
  // Get properties with filters
  getProperties: async (filters: PropertyFilter, type?: string) => {
    const response = await api.get(
      type ? `/properties/filter/${type}` : "/properties",
      { params: filters }
    );
    return response.data;
  },

  // Get property by ID
  getProperty: async (id: number) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  createProperty: async (data: CreatePropertyData) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key !== "featured_image" && value !== null) {
        formData.append(key, String(value));
      }
    });

    if (data.featured_image) {
      formData.append("featured_image", data.featured_image);
    }

    const response = await api.post("/properties", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateProperty: async (
    id: number,
    data: Partial<CreatePropertyData>
  ): Promise<SinglePropertyResponse> => {
    const response = await api.post(`/properties/${id}`, data);
    return response.data;
  },

  deleteProperty: (id: number) => {
    return api.delete(`/properties/${id}`);
  },

  // Get property types
  getPropertyTypes: async () => {
    const response = await api.get("/property-types");
    return response.data;
  },

  // Get property statuses
  getPropertyStatuses: async () => {
    const response = await api.get("/property-statuses");
    return response.data;
  },

  // Get cities
  getCities: async () => {
    const response = await api.get("/cities");
    return response.data;
  },

  // Get amenities
  getAmenities: async () => {
    const response = await api.get("/amenities");
    return response.data;
  },

  // Get featured properties
  getFeaturedProperties: async () => {
    const response = await api.get("/featured-properties");
    return response.data;
  },

  async toggleFavorite(id: string) {
    const response = await api.post(`/properties/${id}/favorite`);
    return response.data;
  },
};
