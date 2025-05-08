"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/common/Button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/common/Form";
import { Separator } from "@/components/ui/common/Separator";
import { Skeleton } from "@/components/ui/common/Skeleton";
import { Textarea } from "@/components/ui/common/Textarea";
import { Input } from "@/components/ui/common/input";
import { FormWrapper } from "@/components/ui/elements/FormWrapper";

import { useChangeProfileInfoMutation } from "@/graphql/generated/output";

import { useCurrent } from "@/hooks/useCurrent";

import {
  ChangeInfoSchema,
  type TypeChangeInfoSchema,
} from "@/schemas/user/change-info.schema";

const ChangeInfoForm = () => {
  const t = useTranslations("dashboard.settings.profile.info");

  const { user, isLoadingProfile, refetch } = useCurrent();

  const form = useForm<TypeChangeInfoSchema>({
    resolver: zodResolver(ChangeInfoSchema),
    values: {
      username: user?.username ?? "",
      displayName: user?.displayName ?? "",
      bio: user?.bio ?? "",
    },
  });

  const [update, { loading: isLoadingInfoUpdate }] =
    useChangeProfileInfoMutation({
      onCompleted() {
        refetch();
        toast.success(t("successMessage"));
      },
      onError() {
        toast.error(t("errorMessage"));
      },
    });

  const { isValid, isDirty } = form.formState;

  const onSubmit = (data: TypeChangeInfoSchema) => {
    update({
      variables: {
        data,
      },
    });
  };

  return isLoadingProfile ? (
    <ChangeInfoFormSkeleton />
  ) : (
    <FormWrapper heading={t("heading")}>
      <Form {...form}>
        <form className="grid gap-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="px-5 pb-3">
                <FormLabel>{t("usernameLabel")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("usernamePlaceholder")}
                    disabled={isLoadingInfoUpdate}
                    {...field}
                  />
                </FormControl>
                <FormDescription>{t("usernameDescription")}</FormDescription>
              </FormItem>
            )}
          />
          <Separator />

          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem className="px-5 pb-3">
                <FormLabel>{t("displayNameLabel")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("displayNamePlaceholder")}
                    disabled={isLoadingInfoUpdate}
                    {...field}
                  />
                </FormControl>
                <FormDescription>{t("displayNameDescription")}</FormDescription>
              </FormItem>
            )}
          />
          <Separator />
          <FormField
            name="bio"
            control={form.control}
            render={({ field }) => (
              <FormItem className="px-5 pb-3">
                <FormLabel>{t("bioLabel")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("bioPlaceholder")}
                    disabled={isLoadingInfoUpdate}
                    {...field}
                  />
                </FormControl>
                <FormDescription>{t("bioDescription")}</FormDescription>
              </FormItem>
            )}
          ></FormField>
          <Separator />

          <div className="flex justify-end p-5">
            <Button disabled={!isValid || !isDirty || isLoadingInfoUpdate}>
              {t("submitButton")}
            </Button>
          </div>
        </form>
      </Form>
    </FormWrapper>
  );
};

export const ChangeInfoFormSkeleton = () => {
  return <Skeleton className="h-96 w-full" />;
};

export default ChangeInfoForm;
