import { Maximize, Minimize } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/common/Button";
import Hint from "@/components/ui/elements/Hint";

interface FullScreenControlProps {
  isFullscreen: boolean;
  onToggle: () => void;
}
const FullscreenControl = ({
  isFullscreen,
  onToggle,
}: FullScreenControlProps) => {
  const t = useTranslations("stream.video.player.fullscreen");

  const Icon = isFullscreen ? Minimize : Maximize;

  return (
    <div className="flex items-center justify-center gap-4">
      <Hint label={isFullscreen ? t("exit") : t("open")} asChild>
        <Button
          className="text-white hover:bg-white/10"
          variant="ghost"
          size="icon"
          onClick={onToggle}
        >
          <Icon className="size-6" />
        </Button>
      </Hint>
    </div>
  );
};

export default FullscreenControl;
