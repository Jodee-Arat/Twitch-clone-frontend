import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/common/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/common/InputOTP";

import {
  useEnableTotpMutation,
  useGenerateTotpSecretQuery,
} from "@/graphql/generated/output";

import { useCurrent } from "@/hooks/useCurrent";

import {
  TypeEnableTotpSchema,
  enableTotpSchema,
} from "@/schemas/user/enable-totp.schema";

const EnableTotp = () => {
  const t = useTranslations("dashboard.settings.account.twoFactor.enable");

  const [isOpen, setIsOpen] = useState(false);

  const { refetch } = useCurrent();

  const { data, loading: isLoadingGenerateTotp } = useGenerateTotpSecretQuery();
  const twoFactor = data?.generateTotpSecret;

  const form = useForm<TypeEnableTotpSchema>({
    resolver: zodResolver(enableTotpSchema),
    defaultValues: {
      pin: "",
    },
  });

  const [enable, { loading: isLoadingEnableTotp }] = useEnableTotpMutation({
    onCompleted() {
      refetch();
      toast.success(t("successMessage"));
      setIsOpen(false);
    },
    onError(error) {
      toast.error(t("errorMessage"));
    },
  });

  const { isValid } = form.formState;

  function onSubmit(data: TypeEnableTotpSchema) {
    enable({
      variables: {
        data: {
          pin: data.pin,
          secret: twoFactor?.secret ?? "",
        },
      },
    });
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{t("trigger")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("heading")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <span className="text-muted-foreground text-sm">
                {twoFactor?.qrcodeUrl ? t("qrInstructions") : ""}
              </span>
              <img className="rounded-lg" src={twoFactor?.qrcodeUrl} alt="QR" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-muted-foreground text-center text-sm">
                {twoFactor?.secret
                  ? t("secretCodeLabel") + twoFactor.secret
                  : ""}
              </span>
            </div>
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-center max-sm:items-center">
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
            <DialogFooter>
              <Button
                type="submit"
                disabled={
                  !isValid || isLoadingGenerateTotp || isLoadingEnableTotp
                }
              >
                {t("submitButton")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EnableTotp;
