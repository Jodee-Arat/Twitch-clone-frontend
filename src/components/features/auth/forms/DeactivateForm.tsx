"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/common/InputOTP";
import { Input } from "@/components/ui/common/input";

import { useDeactivateAccountMutation } from "@/graphql/generated/output";

import { useAuth } from "@/hooks/useAuth";

import {
  TypeDeactivateSchema,
  deactivateSchema,
} from "@/schemas/auth/deactivate.schema";

import AuthWrapper from "../AuthWrapper";

const DeactivateForm = () => {
  const t = useTranslations("auth.deactivate");

  const router = useRouter();

  const { exit } = useAuth();

  const [isShowConfirm, setIsShowConfirm] = useState(false);

  const form = useForm<TypeDeactivateSchema>({
    resolver: zodResolver(deactivateSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [deactivate, { loading: isLoadingDeactivateAccount }] =
    useDeactivateAccountMutation({
      onCompleted(data) {
        if (data.deactivateAccount.message) {
          setIsShowConfirm(true);
        } else {
          exit();
          toast.success(t("successMessage"));
          router.push("/");
        }
      },
      onError() {
        toast.error(t("errorMessage"));
      },
    });

  const { isValid } = form.formState;

  const onSubmit = (data: TypeDeactivateSchema) => {
    deactivate({
      variables: {
        data,
      },
    });
  };

  return (
    <AuthWrapper
      heading={t("heading")}
      backButtonLabel={t("backButtonLabel")}
      backButtonHref="/dashboard/settings"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
          {isShowConfirm ? (
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pinLabel")}</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>{t("pinDescription")}</FormDescription>
                </FormItem>
              )}
            />
          ) : (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("emailLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="jodee@mail.ru"
                        disabled={isLoadingDeactivateAccount}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>{t("emailDescription")}</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">{t("passwordLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        type="password"
                        disabled={isLoadingDeactivateAccount}
                        {...field}
                      />
                    </FormControl>

                    <FormDescription>
                      {t("passwordDescription")}
                    </FormDescription>
                  </FormItem>
                )}
              />
            </>
          )}
          <Button
            className="mt-2 w-full"
            disabled={!isValid || isLoadingDeactivateAccount}
          >
            {t("submitButton")}
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  );
};

export default DeactivateForm;
