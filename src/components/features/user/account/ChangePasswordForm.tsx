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
import { Input } from "@/components/ui/common/input";
import { FormWrapper } from "@/components/ui/elements/FormWrapper";

import { useChangePasswordMutation } from "@/graphql/generated/output";

import { useCurrent } from "@/hooks/useCurrent";

import {
  ChangePasswordSchema,
  type TypeChangePasswordSchema,
} from "@/schemas/user/change-password.schema";

const ChangePasswordForm = () => {
  const t = useTranslations("dashboard.settings.account.password");

  const { isLoadingProfile, refetch } = useCurrent();

  const form = useForm<TypeChangePasswordSchema>({
    resolver: zodResolver(ChangePasswordSchema),
    values: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const [change, { loading: isLoadingChangePassword }] =
    useChangePasswordMutation({
      onCompleted() {
        refetch();
        form.reset();

        toast.success(t("successMessage"));
      },
      onError() {
        toast.error(t("errorMessage"));
      },
    });

  const { isValid } = form.formState;

  const onSubmit = (data: TypeChangePasswordSchema) => {
    change({
      variables: {
        data,
      },
    });
  };

  return isLoadingChangePassword || isLoadingProfile ? (
    <ChangePasswordFormSkeleton />
  ) : (
    <FormWrapper heading={t("heading")}>
      <Form {...form}>
        <form className="grid gap-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="oldPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem className="px-5 pb-3">
                <FormLabel>{t("oldPasswordLabel")}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="*********"
                    disabled={isLoadingChangePassword}
                    {...field}
                  />
                </FormControl>
                <FormDescription>{t("oldPasswordDescription")}</FormDescription>
              </FormItem>
            )}
          />
          <Separator />
          <FormField
            name="newPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem className="px-5 pb-3">
                <FormLabel>{t("newPasswordLabel")}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="*********"
                    disabled={isLoadingChangePassword}
                    {...field}
                  />
                </FormControl>
                <FormDescription>{t("newPasswordDescription")}</FormDescription>
              </FormItem>
            )}
          />
          <Separator />

          <div className="flex justify-end p-5">
            <Button disabled={!isValid || isLoadingChangePassword}>
              {t("submitButton")}
            </Button>
          </div>
        </form>
      </Form>
    </FormWrapper>
  );
};

export const ChangePasswordFormSkeleton = () => {
  return <Skeleton className="h-96 w-full" />;
};

export default ChangePasswordForm;
