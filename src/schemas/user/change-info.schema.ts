import { z } from "zod";

export const ChangeInfoSchema = z.object({
  username: z
    .string()
    .min(1)
    .regex(/^[a-zA-Z0-9_]+(?:-[a-zA-Z0-9_]+)*$/),
  displayName: z.string().min(3),
  bio: z.string().max(300),
});

export type TypeChangeInfoSchema = z.infer<typeof ChangeInfoSchema>;
