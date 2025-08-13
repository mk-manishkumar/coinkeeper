import axios from "axios";
import { store } from "@/store/store";

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API,
  withCredentials: true,  
});

// Automatically attach token if available
instance.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.user?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});