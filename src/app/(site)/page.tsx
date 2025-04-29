"use client";

import ChannelAvatar from "@/components/ui/elements/ChannelAvatar";

import { useCurrent } from "@/hooks/useCurrent";

export default function Home() {
  const { user, isLoadingProfile } = useCurrent();

  return (
    <div className="">
      {isLoadingProfile ? (
        <div>Loading..</div>
      ) : (
        <div>{JSON.stringify(user)}</div>
      )}
    </div>
  );
}
