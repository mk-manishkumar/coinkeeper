import axios from "axios";
import { store } from "@/store/store";

export const instance = axios.create({
  baseURL: "http://localhost:3005/api/v1",
  withCredentials: true, // send cookies 
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