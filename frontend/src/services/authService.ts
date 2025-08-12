import { instance } from "./axiosInstance";

// Register a new user
export const registerUser = (data: { username: string; fullname: string; password: string }) =>
  instance.post("/auth/register", data);

// Login existing user
export const loginUser = (data: { username: string; password: string }) =>
  instance.post("/auth/login", data);

// Logout 
export const logoutUser = () =>
  instance.post("/auth/logout");

// Guest sign-in 
export const guestSignIn = () =>
  instance.post("/auth/guest-signin");

// Check if the token is valid and return user info
export const checkAuth = () =>
  instance.get("/auth/check-auth");
