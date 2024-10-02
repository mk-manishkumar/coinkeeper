import { z } from "zod";

// for registering new account
export const userRegisterSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long.")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain alphanumeric characters, underscores, and hyphens."),

  fullname: z.string().min(3, "Name must be at least 3 characters").max(30, "Name must be less than or equal to 30 characters"),

  password: z.string().min(4, "Password must be at least 4 characters"),
});
