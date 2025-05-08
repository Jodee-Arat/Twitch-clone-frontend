import { z } from "zod";

export const ChangeEmailSchema = z.object({
  email: z.string().email(),
});

export type TypeChangeEmailSchema = z.infer<typeof ChangeEmailSchema>;
