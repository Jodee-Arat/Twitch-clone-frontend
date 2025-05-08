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

import {
  useCreateSocialLinkMutation,
  useFindSocialLinksQuery,
} from "@/graphql/generated/output";

import {
  SocialLinksSchema,
  TypeSocialLinksSchema,
} from "@/schemas/user/social-links.schema";

import SocialLinksList from "./SocialLinksList";

export const SocialLinksForm = () => {
  const t = useTranslations(
    "dashboard.settings.profile.socialLinks.createForm"
  );

  const { loading: isLoadingLinks, refetch } = useFindSocialLinksQuery();

  const form = useForm<TypeSocialLinksSchema>({
    resolver: zodResolver(SocialLinksSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });

  const [create, { loading: isLoadingSocialLinkCreate }] =
    useCreateSocialLinkMutation({
      onCompleted() {
        form.reset();
        refetch();
        toast.success(t("successMessage"));
      },
      onError() {
        toast.error(t("errorMessage"));
      },
    });

  const { isValid } = form.formState;

  const onSubmit = (data: TypeSocialLinksSchema) => {
    create({
      variables: {
        data,
      },
    });
  };

  return isLoadingLinks ? (
    <SocialLinksFormSkeleton />
  ) : (
    <FormWrapper heading={t("heading")}>
      <Form {...form}>
        <form className="grid gap-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="px-5">
                <FormLabel>{t("titleLabel")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("titlePlaceholder")}
                    disabled={isLoadingSocialLinkCreate}
                    {...field}
                  />
                </FormControl>
                <FormDescription>{t("titleDescription")}</FormDescription>
              </FormItem>
            )}
          />
          <Separator />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="px-5 pb-3">
                <FormLabel>{t("urlLabel")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("urlPlaceholder")}
                    disabled={isLoadingSocialLinkCreate}
                    {...field}
                  />
                </FormControl>
                <FormDescription>{t("urlDescription")}</FormDescription>
              </FormItem>
            )}
          />
          <Separator />

          <div className="flex justify-end p-5">
            <Button disabled={!isValid || isLoadingSocialLinkCreate}>
              {t("submitButton")}
            </Button>
          </div>
        </form>
      </Form>
      <SocialLinksList />
    </FormWrapper>
  );
};

export const SocialLinksFormSkeleton = () => {
  return <Skeleton className="h-72 w-full" />;
};

export default SocialLinksForm;
