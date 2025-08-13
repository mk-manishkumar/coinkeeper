import { instance } from "./axiosInstance";

// Register a new user
export const registerUser = (data: { username: string; fullname: string; password: string }) =>
  instance.post("/api/v1/auth/register", data);

// Login existing user
export const loginUser = (data: { username: string; password: string }) =>
  instance.post("/api/v1/auth/login", data);

// Logout 
export const logoutUser = () =>
  instance.post("/api/v1/auth/logout");

// Guest sign-in 
export const guestSignIn = () =>
  instance.post("/api/v1/auth/guest-signin");

// Check if the token is valid and return user info
export const checkAuth = () =>
  instance.get("/api/v1/auth/check-auth");
