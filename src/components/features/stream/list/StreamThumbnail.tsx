"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Card } from "@/components/ui/common/Card";
import ChannelAvatar from "@/components/ui/elements/ChannelAvatar";
import { LiveBadge } from "@/components/ui/elements/LiveBadge";

import { type FindProfileQuery } from "@/graphql/generated/output";

import { getRandomColor } from "@/utils/color";
import { getMediaSource } from "@/utils/get-media-source";

interface StreamThumbnailProps {
  url: string | null | undefined;
  user: Pick<
    FindProfileQuery["findProfile"],
    "username" | "avatar" | "isVerified"
  >;
  isLive?: boolean;
}

const StreamThumbnail = ({ url, user, isLive }: StreamThumbnailProps) => {
  const [randomColor, setRandomColor] = useState("");

  useEffect(() => {
    setRandomColor(getRandomColor());
  }, []);

  return (
    <div className="group relative aspect-video cursor-pointer rounded-lg">
      <div
        className="absolute inset-0 flex items-center justify-center rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
        style={{ backgroundColor: randomColor }}
      />
      {url ? (
        <Image
          src={getMediaSource(url)}
          alt={user.username}
          fill
          className="rounded-lg object-cover transition-transform group-hover:-translate-y-2 group-hover:translate-x-2"
        />
      ) : (
        <Card className="flex h-full w-full flex-col items-center justify-center gap-y-4 rounded-lg transition-transform group-hover:-translate-y-2 group-hover:translate-x-2">
          <ChannelAvatar channel={user} isLive={isLive} />
        </Card>
      )}
      {isLive && (
        <div className="absolute right-2 top-2 transition-transform group-hover:-translate-y-2 group-hover:translate-x-2">
          <LiveBadge />
        </div>
      )}
    </div>
  );
};

export default StreamThumbnail;
