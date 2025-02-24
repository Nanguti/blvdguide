import api from "@/lib/services/api";
import { PropertyFilter } from "@/types/property";

export const propertyService = {
  getProperties: async (filters: any) => {
    const response = await api.get("/properties", { params: filters });
    console.log("response.data", response.data);
    return response.data;
  },

  getProperty: (id: number) => {
    return api.get(`/properties/${id}`);
  },

  createProperty: async (data: any) => {
    const formData = new FormData();

    // Append all regular fields
    Object.keys(data).forEach((key) => {
      if (key !== "featured_image") {
        formData.append(key, data[key]);
      }
    });

    // Append featured image if exists
    if (data.featured_image) {
      formData.append("featured_image", data.featured_image);
    }

    const response = await api.post("/properties", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateProperty: (id: number, data: any) => {
    return api.post(`/properties/${id}`, data);
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
    return response;
  },

  async toggleFavorite(id: string) {
    const response = await api.post(`/properties/${id}/favorite`);
    return response.data;
  },
};
