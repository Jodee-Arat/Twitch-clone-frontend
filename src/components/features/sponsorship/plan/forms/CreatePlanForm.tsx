"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/common/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/common/Dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/common/Form";
import { Separator } from "@/components/ui/common/Separator";
import { Textarea } from "@/components/ui/common/Textarea";
import { Input } from "@/components/ui/common/input";

import {
  useCreateSponsorshipPlanMutation,
  useFindMySponsorshipPlansQuery,
} from "@/graphql/generated/output";

import {
  TypeCreatePlanSchema,
  createPlanSchema,
} from "@/schemas/plan/create-plan.schema";

const CreatePlanForm = () => {
  const t = useTranslations("dashboard.plans.createForm");

  const { refetch } = useFindMySponsorshipPlansQuery();

  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<TypeCreatePlanSchema>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
  });

  const [create, { loading: isLoadingCreatePlan }] =
    useCreateSponsorshipPlanMutation({
      onCompleted() {
        refetch();
        setIsOpen(false);
        form.reset();

        toast.success(t("successMessage"));
      },
      onError() {
        toast.error(t("errorMessage"));
      },
    });

  const { isValid } = form.formState;

  const onSubmit = (data: TypeCreatePlanSchema) => {
    create({
      variables: {
        data,
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{t("trigger")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("heading")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem className="px-5 pb-3">
                  <FormLabel>{t("titleLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("titlePlaceholder")}
                      disabled={isLoadingCreatePlan}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{t("titleDescription")}</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem className="px-5 pb-3">
                  <FormLabel>{t("descriptionLabel")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("descriptionPlaceholder")}
                      disabled={isLoadingCreatePlan}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("descriptionDescription")}
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem className="px-5 pb-3">
                  <FormLabel>{t("priceLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("priceLabel")}
                      type="number"
                      disabled={isLoadingCreatePlan}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{t("priceDescription")}</FormDescription>
                </FormItem>
              )}
            />
            <Separator />

            <div className="flex justify-end p-5">
              <Button disabled={!isValid || isLoadingCreatePlan}>
                {t("submitButton")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlanForm;
