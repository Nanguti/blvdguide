import api from "./api";

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post("/login", { email, password });
    return response.data;
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role?: string;
  }) {
    const response = await api.post("/register", data);
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await api.post("/forgot-password", { email });
    return response.data;
  },

  async resetPassword(data: {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
  }) {
    const response = await api.post("/reset-password", data);
    return response.data;
  },

  async verifyEmail(token: string) {
    const response = await api.post("/verify-email", { token });
    return response.data;
  },
};
