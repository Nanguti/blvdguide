import api from "@/lib/services/api";
import { Property, PropertyFilter } from "@/types/property";

interface PropertyResponse {
  data: Property[];
  // Add other response fields if needed
}

interface SinglePropertyResponse {
  data: Property;
}

export type CreatePropertyData = Omit<Property, "id" | "featured_image"> & {
  featured_image?: File | string | null;
};

export const propertyService = {
  getProperties: async (filters: PropertyFilter): Promise<PropertyResponse> => {
    const response = await api.get("/properties", { params: filters });
    console.log("response.data", response.data);
    return response.data;
  },

  getProperty: async (id: number): Promise<SinglePropertyResponse> => {
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

  getPropertyTypes: async () => {
    const response = await api.get("/property-types");
    return response.data;
  },

  getPropertyStatuses: async () => {
    const response = await api.get("/property-statuses");
    return response.data;
  },

  getCities: async () => {
    const response = await api.get("/states/2/cities");
    return response.data;
  },

  getAmenities: async () => {
    const response = await api.get("/amenities");
    return response.data;
  },

  async toggleFavorite(id: string) {
    const response = await api.post(`/properties/${id}/favorite`);
    return response.data;
  },
};
