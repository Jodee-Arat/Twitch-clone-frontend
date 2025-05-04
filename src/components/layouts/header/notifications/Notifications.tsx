import { Bell, Loader } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/common/Popover";

import { useFindUnreadNotificationCountQuery } from "@/graphql/generated/output";

import NotificationsList from "./NotificationsList";

const Notifications = () => {
  const { data, loading: isLoadingCount } =
    useFindUnreadNotificationCountQuery();
  const count = data?.findUnreadNotificationCount || 0;

  const displayCount = count > 10 ? "9+" : count;

  if (isLoadingCount) {
    return <Loader className="text-muted-foreground size-6 animate-spin" />;
  }
  return (
    <Popover>
      <PopoverTrigger>
        {count != 0 && (
          <div className="bg-primary absolute right-[72px] top-5 rounded-full px-[5px] text-xs font-semibold text-white">
            {displayCount}
          </div>
        )}
        <Bell className="text-foreground size-5 cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="max-h-[500px] w-[320px] overflow-y-auto"
      >
        <NotificationsList />
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
