import { z } from "zod";

export const loginAccountSchema = z.object({
  login: z.string().min(1),
  password: z.string().min(8).max(32),
  pin: z.string().optional(),
});

export type TypeLoginAccountSchema = z.infer<typeof loginAccountSchema>;
