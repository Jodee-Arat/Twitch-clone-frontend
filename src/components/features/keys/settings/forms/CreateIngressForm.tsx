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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/common/Select";
import { Separator } from "@/components/ui/common/Separator";

import { useCreateIngressMutation } from "@/graphql/generated/output";

import { useCurrent } from "@/hooks/useCurrent";

import {
  IngressType,
  TypeCreateIngressSchema,
  createIngressSchema,
} from "@/schemas/stream/create-ingress.schema";

const CreateIngressForm = () => {
  const t = useTranslations("dashboard.keys.createModal");

  const { refetch } = useCurrent();

  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<TypeCreateIngressSchema>({
    resolver: zodResolver(createIngressSchema),
    defaultValues: {
      ingressType: IngressType.RTMP,
    },
  });

  const [create, { loading: isLoadingCreateIngress }] =
    useCreateIngressMutation({
      onCompleted() {
        refetch();
        setIsOpen(false);
        toast.success(t("successMessage"));
      },
      onError() {
        toast.error(t("errorMessage"));
      },
    });

  const { isValid } = form.formState;

  const onSubmit = (data: TypeCreateIngressSchema) => {
    create({
      variables: {
        ingressType: data.ingressType,
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
              name="ingressType"
              control={form.control}
              render={({ field }) => (
                <FormItem className="px-5 pb-3">
                  <FormLabel>{t("ingressTypeLabel")}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(Number(value));
                      }}
                      defaultValue={field.value.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("ingressTypePlaceholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value={IngressType.RTMP.toString()}
                          disabled={isLoadingCreateIngress}
                        >
                          RTMP
                        </SelectItem>
                        <SelectItem
                          value={IngressType.WHIP.toString()}
                          disabled={isLoadingCreateIngress}
                        >
                          WHIP
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    {t("ingressTypeDescription")}
                  </FormDescription>
                </FormItem>
              )}
            ></FormField>
            <Separator />

            <div className="flex justify-end p-5">
              <Button disabled={!isValid || isLoadingCreateIngress}>
                {t("submitButton")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIngressForm;
