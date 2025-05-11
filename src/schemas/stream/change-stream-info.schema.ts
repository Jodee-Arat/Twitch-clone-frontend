import { z } from "zod";

export const changeStreamInfoSchema = z.object({
  title: z.string().min(1),
  categoryId: z.string().min(1),
});

export type TypeChangeStreamInfoSchema = z.infer<typeof changeStreamInfoSchema>;
