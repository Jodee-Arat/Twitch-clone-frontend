"use client";

import { WifiOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { CSSProperties } from "react";

import { Card } from "@/components/ui/common/Card";

import { FindChannelByUsernameQuery } from "@/graphql/generated/output";

import { getMediaSource } from "@/utils/get-media-source";

interface OfflineStreamProps {
  channel: FindChannelByUsernameQuery["findChannelByUsername"];
}

const OfflineStream = ({ channel }: OfflineStreamProps) => {
  const t = useTranslations("stream.video");

  const backgroundStyle: CSSProperties = channel.streams.thumbnailUrl
    ? {
        backgroundImage: `url(${getMediaSource(channel.streams.thumbnailUrl)})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {};

  return (
    <Card
      className="flex h-full flex-col items-center justify-center"
      style={backgroundStyle}
    >
      {channel.streams.thumbnailUrl && (
        <div className="absolute inset-0 z-0 rounded-lg bg-black opacity-60" />
      )}
      <WifiOff className="text-muted-foreground z-10 size-12" />
      <p className="z-10 mt-3 text-lg text-white">
        {channel.displayName} {t("offline")}
      </p>
    </Card>
  );
};

export default OfflineStream;
