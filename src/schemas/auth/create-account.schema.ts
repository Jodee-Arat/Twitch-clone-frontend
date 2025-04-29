import { z } from "zod";

export const createAccountSchema = z.object({
  username: z
    .string()
    .min(1)
    .regex(/^[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*$/),
  email: z.string().email().min(3),
  password: z.string().min(8).max(32),
});

export type TypeCreateAccountSchema = z.infer<typeof createAccountSchema>;
