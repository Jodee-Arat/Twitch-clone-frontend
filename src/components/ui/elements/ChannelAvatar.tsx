import { type VariantProps, cva } from "class-variance-authority";

import { FindProfileQuery } from "@/graphql/generated/output";

import { getMediaSource } from "@/utils/get-media-source";
import { cn } from "@/utils/tw-merge";

import { Avatar, AvatarFallback, AvatarImage } from "../common/Avatar";

const avatarSizes = cva("", {
  variants: {
    size: {
      sm: "size-7",
      default: "size-9",
      lg: "size-14",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface ChannelAvatarProps extends VariantProps<typeof avatarSizes> {
  channel: Pick<FindProfileQuery["findProfile"], "username" | "avatar">;
  isLIve?: boolean;
}

const ChannelAvatar = ({ size, channel, isLIve }: ChannelAvatarProps) => {
  return (
    <div className="relative">
      <Avatar
        className={cn(avatarSizes({ size }), isLIve && "ring-2 ring-rose-500")}
      >
        <AvatarImage
          src={getMediaSource(channel.avatar!)}
          className="object-cover"
        />
        <AvatarFallback>{channel?.username?.[0]}</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default ChannelAvatar;
