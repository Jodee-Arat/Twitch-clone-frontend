"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
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

import { useLoginUserMutation } from "@/graphql/generated/output";

import { useAuth } from "@/hooks/useAuth";

import {
  TypeLoginAccountSchema,
  loginAccountSchema,
} from "@/schemas/auth/login.account.schema";

import AuthWrapper from "../AuthWrapper";

const LoginForm = () => {
  const t = useTranslations("auth.login");

  const router = useRouter();

  const { auth } = useAuth();

  const [isShowTwoFactor, setIsShowTwoFactor] = useState(false);

  const form = useForm<TypeLoginAccountSchema>({
    resolver: zodResolver(loginAccountSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const [login, { loading: isLoadingLogin }] = useLoginUserMutation({
    onCompleted(data) {
      if (data.loginUser.message) {
        setIsShowTwoFactor(true);
      } else {
        auth();
        toast.success(t("successMessage"));
        router.push("/dashboard");
      }
    },
    onError() {
      toast.error(t("errorMessage"));
    },
  });

  const { isValid } = form.formState;

  const onSubmit = (data: TypeLoginAccountSchema) => {
    login({
      variables: {
        data,
      },
    });
  };

  return (
    <AuthWrapper
      heading={t("heading")}
      backButtonLabel={t("backButtonLabel")}
      backButtonHref="/account/create"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
          {isShowTwoFactor ? (
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
                name="login"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("loginLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Johndoe"
                        disabled={isLoadingLogin}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>{t("loginDescription")}</FormDescription>
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
                        disabled={isLoadingLogin}
                        {...field}
                      />
                    </FormControl>

                    <Link
                      href="/account/recovery"
                      className="ml-auto inline-block text-sm"
                    >
                      {t("forgotPassword")}
                    </Link>
                  </FormItem>
                )}
              />
            </>
          )}
          <Button className="mt-2 w-full" disabled={!isValid || isLoadingLogin}>
            {t("submitButton")}
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  );
};

export default LoginForm;
