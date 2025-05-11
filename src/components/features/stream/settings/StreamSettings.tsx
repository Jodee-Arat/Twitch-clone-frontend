import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/common/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/common/Dialog";

import { type FindChannelByUsernameQuery } from "@/graphql/generated/output";

import { useCurrent } from "@/hooks/useCurrent";

import { ChangeInfoForm } from "./ChangeInfoForm";
import { ChangeThumbnailForm } from "./ChangeThumbnailForm";

interface StreamSettingsProps {
  channel: FindChannelByUsernameQuery["findChannelByUsername"];
}
const StreamSettings = ({ channel }: StreamSettingsProps) => {
  const t = useTranslations("stream.settings");

  const { user } = useCurrent();

  const isOwnerChannel = user?.id === channel.id;

  if (!isOwnerChannel) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="lgIcon">
          <Pencil className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{t("heading")}</DialogTitle>
        </DialogHeader>
        <ChangeThumbnailForm stream={channel.streams} />
        <ChangeInfoForm stream={channel.streams} />
      </DialogContent>
    </Dialog>
  );
};

export default StreamSettings;
