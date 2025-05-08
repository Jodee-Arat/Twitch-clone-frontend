import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/common/Button";
import ConfirmModal from "@/components/ui/elements/ConfirmModal";

import { useDisableTotpMutation } from "@/graphql/generated/output";

import { useCurrent } from "@/hooks/useCurrent";

const DisableTotp = () => {
  const t = useTranslations("dashboard.settings.account.twoFactor.disable");

  const { refetch } = useCurrent();

  const [disable, { loading: isLoadingDisableTotp }] = useDisableTotpMutation({
    onCompleted() {
      refetch();
      toast.success(t("successMessage"));
    },
    onError(error) {
      toast.error(t("errorMessage"));
    },
  });
  return (
    <ConfirmModal
      heading={t("heading")}
      message={t("message")}
      onConfirm={() => disable()}
    >
      <Button variant="secondary" disabled={isLoadingDisableTotp}>
        {t("trigger")}
      </Button>
    </ConfirmModal>
  );
};

export default DisableTotp;
