import { z } from "zod";

export const ChangeNotificationsSettingsSchema = z.object({
  siteNotifications: z.boolean(),
  telegramNotifications: z.boolean(),
});

export type TypeChangeNotificationsSettingsSchema = z.infer<
  typeof ChangeNotificationsSettingsSchema
>;
