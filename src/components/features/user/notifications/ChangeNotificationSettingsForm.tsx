"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Form, FormField } from "@/components/ui/common/Form";
import ToggleCard, {
  ToggleCardSkeleton,
} from "@/components/ui/elements/ToggleCard";

import { useChangeNotificationSettingsMutation } from "@/graphql/generated/output";

import { useCurrent } from "@/hooks/useCurrent";

import { TELEGRAM_BOT_NAME } from "@/libs/constants/url.constant";

import {
  ChangeNotificationsSettingsSchema,
  TypeChangeNotificationsSettingsSchema,
} from "@/schemas/user/change-notifications-settings.schema";

const ChangeNotificationSettingsForm = () => {
  const t = useTranslations("dashboard.settings.notifications");

  const { user, isLoadingProfile, refetch } = useCurrent();

  const form = useForm<TypeChangeNotificationsSettingsSchema>({
    resolver: zodResolver(ChangeNotificationsSettingsSchema),
    values: {
      telegramNotifications:
        user?.notificationSettings?.telegramNotifications ?? false,
      siteNotifications: user?.notificationSettings?.siteNotifications ?? false,
    },
  });

  const [change, { loading: isLoadingChangeNotifications }] =
    useChangeNotificationSettingsMutation({
      onCompleted(data) {
        refetch();
        toast.success(t("successMessage"));
        if (data.changeNotificationSettings.telegramAuthToken) {
          window.open(
            `https://t.me/${TELEGRAM_BOT_NAME}?start=${data.changeNotificationSettings.telegramAuthToken}`,
            "_blank"
          );
        }
      },
      onError() {
        toast.error(t("errorMessage"));
      },
    });

  const onChange = (
    field: keyof TypeChangeNotificationsSettingsSchema,
    value: boolean
  ) => {
    form.setValue(field, value);
    change({
      variables: {
        data: {
          ...form.getValues(),
          [field]: value,
        },
      },
    });
  };

  return isLoadingProfile ? (
    Array.from({ length: 2 }).map((_, index) => (
      <ToggleCardSkeleton key={index} />
    ))
  ) : (
    <Form {...form}>
      <FormField
        name="siteNotifications"
        control={form.control}
        render={({ field }) => (
          <ToggleCard
            heading={t("siteNotifications.heading")}
            description={t("siteNotifications.description")}
            isDisabled={isLoadingChangeNotifications}
            onChange={(value) => onChange("siteNotifications", value)}
            value={field.value}
          />
        )}
      />
      <FormField
        name="telegramNotifications"
        control={form.control}
        render={({ field }) => (
          <ToggleCard
            heading={t("telegramNotifications.heading")}
            isDisabled={isLoadingChangeNotifications}
            description={t("telegramNotifications.description")}
            onChange={(value) => onChange("telegramNotifications", value)}
            value={field.value}
          />
        )}
      />
    </Form>
  );
};

export default ChangeNotificationSettingsForm;
