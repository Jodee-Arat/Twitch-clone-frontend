import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/common/Button";
import CardContainer from "@/components/ui/elements/CardContainer";
import ConfirmModal from "@/components/ui/elements/ConfirmModal";

import {
  FindSessionByUserQuery,
  useFindSessionByUserQuery,
  useRemoveSessionMutation,
} from "@/graphql/generated/output";

import { getBrowserIcon } from "@/utils/get-browser-icon";

import SessionModal from "./SessionModal";

interface SessionItemProps {
  session: FindSessionByUserQuery["findSessionsByUser"][0];
  isCurrentSession?: boolean;
}

const SessionItem = ({ session, isCurrentSession }: SessionItemProps) => {
  const t = useTranslations("dashboard.settings.sessions.sessionItem");

  const { refetch } = useFindSessionByUserQuery();

  const [remove, { loading: isLoadingRemoveSession }] =
    useRemoveSessionMutation({
      onCompleted() {
        refetch();
        toast.success(t("successMessage"));
      },
      onError(error) {
        toast.error(t("errorMessage"));
      },
    });

  const icon = getBrowserIcon(session.metadata.device.browser);

  return (
    <CardContainer
      heading={`${session.metadata.device.browser}, ${session.metadata.device.os}`}
      description={`${session.metadata.location.country}, ${session.metadata.location.city}`}
      Icon={icon}
      rightContent={
        <div className="flex items-center gap-x-4">
          {!isCurrentSession && (
            <ConfirmModal
              heading={t("confirmModal.heading")}
              message={t("confirmModal.message")}
              onConfirm={() =>
                remove({
                  variables: {
                    id: session.id,
                  },
                })
              }
            >
              <Button variant="secondary" disabled={isLoadingRemoveSession}>
                {t("deleteButton")}
              </Button>
            </ConfirmModal>
          )}
          <SessionModal session={session}>
            <Button>{t("detailsButton")}</Button>
          </SessionModal>
        </div>
      }
    />
  );
};

export default SessionItem;
