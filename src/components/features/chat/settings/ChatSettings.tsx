"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Form, FormField } from "@/components/ui/common/Form";
import Heading from "@/components/ui/elements/Heading";
import ToggleCard, {
  ToggleCardSkeleton,
} from "@/components/ui/elements/ToggleCard";

import { useChangeChatSettingsMutation } from "@/graphql/generated/output";

import { useCurrent } from "@/hooks/useCurrent";

import {
  TypeChangeChatSettingsSchema,
  changeChatSettingsSchema,
} from "@/schemas/chat/change-chat-settings.schema";

const ChatSettings = () => {
  const t = useTranslations("dashboard.chat");

  const { user, isLoadingProfile } = useCurrent();

  const form = useForm<TypeChangeChatSettingsSchema>({
    resolver: zodResolver(changeChatSettingsSchema),
    values: {
      isChatEnabled: user?.streams?.isChatEnabled ?? false,
      isChatFollowersOnly: user?.streams?.isChatFollowersOnly ?? false,
      isChatPremiumFollowersOnly:
        user?.streams?.isChatPremiumFollowersOnly ?? false,
    },
  });

  const [change, { loading: isLoadingChangeChatSettings }] =
    useChangeChatSettingsMutation({
      onCompleted(data) {
        toast.success(t("successMessage"));
      },
      onError() {
        toast.error(t("errorMessage"));
      },
    });

  const onChange = (
    field: keyof TypeChangeChatSettingsSchema,
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

  return (
    <div className="mt-3 space-y-6 lg:px-10">
      <Heading
        title={t("header.heading")}
        description={t("header.description")}
        size="lg"
      />
      {isLoadingProfile ? (
        Array.from({ length: 3 }).map((_, index) => (
          <ToggleCardSkeleton key={index} />
        ))
      ) : (
        <Form {...form}>
          <FormField
            name="isChatEnabled"
            control={form.control}
            render={({ field }) => (
              <ToggleCard
                heading={t("isChatEnabled.heading")}
                description={t("isChatEnabled.description")}
                isDisabled={isLoadingChangeChatSettings}
                onChange={(value) => onChange("isChatEnabled", value)}
                value={field.value}
              />
            )}
          />
          <FormField
            name="isChatFollowersOnly"
            control={form.control}
            render={({ field }) => (
              <ToggleCard
                heading={t("isChatFollowersOnly.heading")}
                isDisabled={isLoadingChangeChatSettings}
                description={t("isChatFollowersOnly.description")}
                onChange={(value) => onChange("isChatFollowersOnly", value)}
                value={field.value}
              />
            )}
          />
          <FormField
            name="isChatPremiumFollowersOnly"
            control={form.control}
            render={({ field }) => (
              <ToggleCard
                heading={t("isChatPremiumFollowersOnly.heading")}
                isDisabled={isLoadingChangeChatSettings || !user?.isVerified}
                description={t("isChatPremiumFollowersOnly.description")}
                onChange={(value) =>
                  onChange("isChatPremiumFollowersOnly", value)
                }
                value={field.value}
              />
            )}
          />
        </Form>
      )}
    </div>
  );
};

export default ChatSettings;
