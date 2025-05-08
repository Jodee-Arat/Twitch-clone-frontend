import { z } from "zod";

export const deactivateSchema = z.object({
  email: z.string().email().min(3),
  password: z.string().min(8).max(32),
  pin: z.string().optional(),
});

export type TypeDeactivateSchema = z.infer<typeof deactivateSchema>;
