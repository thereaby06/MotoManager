import axios from "axios";
import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";

export function useApi() {
  const { token, logout } = useAuth();

  return useMemo(() => {
    const api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
    });

    api.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return api;
  }, [token, logout]);
}
