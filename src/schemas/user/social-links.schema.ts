import { z } from "zod";

export const SocialLinksSchema = z.object({
  title: z.string(),
  url: z.string().url(),
});

export type TypeSocialLinksSchema = z.infer<typeof SocialLinksSchema>;
