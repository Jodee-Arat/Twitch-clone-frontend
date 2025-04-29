import { z } from "zod";

export const resetPasswordSchema = z.object({
  email: z.string().email().min(3),
});

export type TypeResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
