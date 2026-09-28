import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().toLowerCase().email(),
  phone: z
    .string()
    .trim()
    .min(7, "Phone number is required")
    .max(20, "Phone number is too long")
    .regex(/^[+]?[\d\s()-]+$/, "Enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
