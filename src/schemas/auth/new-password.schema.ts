import { z } from "zod";

export const newPasswordSchema = z
  .object({
    password: z.string().min(8).max(32),
    passwordRepeat: z.string().min(8).max(32),
  })
  .refine((data) => data.passwordRepeat === data.password, {
    path: ["passwordRepeat"],
  });

export type TypeNewPasswordSchema = z.infer<typeof newPasswordSchema>;
