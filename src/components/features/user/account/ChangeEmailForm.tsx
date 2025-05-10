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

import { useChangeEmailMutation } from "@/graphql/generated/output";

import { useCurrent } from "@/hooks/useCurrent";

import {
  ChangeEmailSchema,
  TypeChangeEmailSchema,
} from "@/schemas/user/change-email.schema";

const ChangeEmailForm = () => {
  const t = useTranslations("dashboard.settings.account.email");

  const { user, isLoadingProfile, refetch } = useCurrent();

  const form = useForm<TypeChangeEmailSchema>({
    resolver: zodResolver(ChangeEmailSchema),
    values: {
      email: user?.email ?? "",
    },
  });

  const [change, { loading: isLoadingChangeEmail }] = useChangeEmailMutation({
    onCompleted() {
      refetch();
      toast.success(t("successMessage"));
    },
    onError(error) {
      toast.error(t("errorMessage"));
    },
  });

  const { isValid, isDirty } = form.formState;

  const onSubmit = (data: TypeChangeEmailSchema) => {
    change({
      variables: {
        data,
      },
    });
  };

  return isLoadingChangeEmail || isLoadingProfile ? (
    <ChangeEmailFormSkeleton />
  ) : (
    <FormWrapper heading={t("heading")}>
      <Form {...form}>
        <form className="grid gap-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem className="px-5 pb-3">
                <FormLabel>{t("emailLabel")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Json_weber@gmail.com"
                    disabled={isLoadingChangeEmail}
                    {...field}
                  />
                </FormControl>
                <FormDescription>{t("emailDescription")}</FormDescription>
              </FormItem>
            )}
          ></FormField>
          <Separator />

          <div className="flex justify-end p-5">
            <Button disabled={!isValid || !isDirty || isLoadingChangeEmail}>
              {t("submitButton")}
            </Button>
          </div>
        </form>
      </Form>
    </FormWrapper>
  );
};

export const ChangeEmailFormSkeleton = () => {
  return <Skeleton className="h-64 w-full" />;
};

export default ChangeEmailForm;
