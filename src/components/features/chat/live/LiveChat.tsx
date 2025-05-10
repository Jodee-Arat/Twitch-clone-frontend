import {
  useConnectionState,
  useRemoteParticipant,
} from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import { MessageSquareOff } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/common/Card";
import { Skeleton } from "@/components/ui/common/Skeleton";

import { FindChannelByUsernameQuery } from "@/graphql/generated/output";

import { useAuth } from "@/hooks/useAuth";

import LoadingChat from "./LoadingChat";
import SendMessageForm from "./SendMessageForm";

interface LiveChatProps {
  channel: FindChannelByUsernameQuery["findChannelByUsername"];
  isChatEnabled: boolean;
  isChatFollowersOnly: boolean;
  isChatPremiumFollowersOnly: boolean;
}

const LiveChat = ({
  channel,
  isChatEnabled,
  isChatFollowersOnly,
  isChatPremiumFollowersOnly,
}: LiveChatProps) => {
  const t = useTranslations("stream.chat");

  const { isAuthenticated } = useAuth();

  const connectionState = useConnectionState();
  const participant = useRemoteParticipant(channel.id);

  const isOnline = participant && ConnectionState.Connected;
  const isDisabled = !!isOnline || !isAuthenticated;

  if (connectionState === ConnectionState.Connecting) {
    return <LoadingChat />;
  }

  return (
    <Card className="flex h-[82%] w-full flex-col overflow-y-auto lg:fixed lg:w-[21.5%] xl:mt-0">
      <CardHeader className="border-b py-2">
        <CardTitle className="text-center text-lg">{t("heading")}</CardTitle>
      </CardHeader>
      <CardContent className="flex h-full flex-col overflow-y-auto p-4">
        {!isOnline ? (
          <>
            <SendMessageForm channel={channel} isDisabled={isDisabled} />
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <MessageSquareOff className="text-muted-foreground size-10" />
            <h2 className="mt-3 text-xl font-medium">{t("unavailable")}</h2>
            <p className="text-muted-foreground mt-1 w-full text-center">
              {t("unavailableMessage")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const LiveChatSkeleton = () => (
  <Skeleton className="fixed my-8 flex h-[82%] w-[21.5%] flex-col overflow-y-auto xl:mt-0" />
);

export default LiveChat;
