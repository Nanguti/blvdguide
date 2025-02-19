import api from "./api";
import { Property, PropertyFilter } from "@/types/property";

export const propertyService = {
  async getProperties(filters?: PropertyFilter, page = 1) {
    const response = await api.get("/properties", {
      params: { ...filters, page },
    });
    return response.data;
  },

  async getProperty(id: string) {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  async toggleFavorite(id: string) {
    const response = await api.post(`/properties/${id}/favorite`);
    return response.data;
  },

  async getPropertyTypes() {
    const response = await api.get("/property-types");
    return response.data;
  },

  async getAmenities() {
    const response = await api.get("/amenities");
    return response.data;
  },
};
