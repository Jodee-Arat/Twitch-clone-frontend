import parse from "html-react-parser";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Fragment } from "react";

import { Separator } from "@/components/ui/common/Separator";

import {
  useFindByUserNotificationsQuery,
  useFindUnreadNotificationCountQuery,
} from "@/graphql/generated/output";

import { getNotificationIcon } from "@/utils/get-notification-icon";

const NotificationsList = () => {
  const t = useTranslations(
    "layout.header.headerMenu.profileMenu.notifications"
  );
  const { refetch } = useFindUnreadNotificationCountQuery();
  const { data, loading: isLoadingNotifications } =
    useFindByUserNotificationsQuery({
      onCompleted() {
        refetch();
      },
    });
  const notifications = data?.findByUserNotifications ?? [];

  return (
    <>
      <h2 className="text-center text-lg font-medium">{t("heading")}</h2>
      <Separator className="my-3" />
      {isLoadingNotifications ? (
        <div className="text-foreground flex items-center justify-center gap-x-2 text-sm">
          {" "}
          <Loader2 className="size-5 animate-spin" />
          {t("loading")}
        </div>
      ) : notifications.length ? (
        notifications.map((notification, index) => {
          const Icon = getNotificationIcon(notification.type);
          return (
            <Fragment key={index}>
              <div className="flex items-center gap-x-3 text-sm">
                <div className="bg-foreground rounded-full p-2">
                  <Icon className="text-secondary size-6" />
                </div>
                <div>{parse(notification.message)}</div>
              </div>
              {index < notifications.length - 1 && (
                <Separator className="my-3" />
              )}
            </Fragment>
          );
        })
      ) : (
        <div className="text-muted-foreground text-center">{t("empty")}</div>
      )}
    </>
  );
};

export default NotificationsList;
