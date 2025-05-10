import { Heart, HeartOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/common/Button";
import ConfirmModal from "@/components/ui/elements/ConfirmModal";

import {
  type FindChannelByUsernameQuery,
  useFindMyFollowingsQuery,
  useFollowChannelMutation,
  useUnfollowChannelMutation,
} from "@/graphql/generated/output";

import { useAuth } from "@/hooks/useAuth";
import { useCurrent } from "@/hooks/useCurrent";

interface FollowButtonProps {
  channel: FindChannelByUsernameQuery["findChannelByUsername"];
}
const FollowButton = ({ channel }: FollowButtonProps) => {
  const t = useTranslations("stream.actions.follow");
  const router = useRouter();

  const { isAuthenticated } = useAuth();
  const { user, isLoadingProfile } = useCurrent();

  const {
    data,
    refetch,
    loading: isLoadingFindFollowings,
  } = useFindMyFollowingsQuery({
    skip: !isAuthenticated,
  });

  const followings = data?.findMyFollowings || [];

  const [follow, { loading: isLoadingFollow }] = useFollowChannelMutation({
    onCompleted() {
      refetch();
      toast.success(t("successFollowMessage"));
    },
    onError() {
      toast.error(t("errorFollowMessage"));
    },
  });
  const [unfollow, { loading: isLoadingUnfollow }] = useUnfollowChannelMutation(
    {
      onCompleted() {
        refetch();
        toast.success(t("successUnfollowMessage"));
      },
      onError() {
        toast.error(t("errorunFollowMessage"));
      },
    }
  );

  const isOwnerChannel = user?.id === channel.id;

  if (isOwnerChannel || isLoadingProfile) return null;

  const isExistingFollow = followings.some(
    (following) => following.followingId === channel.id
  );

  return isExistingFollow ? (
    <ConfirmModal
      heading={t("confirmUnfollowHeading")}
      message={t("confirmUnfollowMessage")}
      onConfirm={() =>
        unfollow({
          variables: {
            channelId: channel.id,
          },
        })
      }
    >
      <Button
        className="cursor-pointer"
        disabled={isLoadingFindFollowings || isLoadingUnfollow}
      >
        <HeartOff className="size-4" />
        {t("unfollowButton")}
      </Button>
    </ConfirmModal>
  ) : (
    <Button
      className="cursor-pointer"
      disabled={isLoadingFindFollowings || isLoadingFollow}
      onClick={() =>
        isAuthenticated
          ? follow({
              variables: {
                channelId: channel.id,
              },
            })
          : router.push("/account/login")
      }
    >
      <Heart className="size-4" />
      {t("followButton")}
    </Button>
  );
};

export default FollowButton;
