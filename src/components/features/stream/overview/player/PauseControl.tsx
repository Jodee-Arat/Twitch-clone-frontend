import { Pause, Play } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/common/Button";
import Hint from "@/components/ui/elements/Hint";

interface PauseControlProps {
  isPaused: boolean;
  onToggle: () => void;
}
const PauseControl = ({ isPaused, onToggle }: PauseControlProps) => {
  const t = useTranslations("stream.video.player.pause");

  const Icon = isPaused ? Play : Pause;

  return (
    <div className="flex items-center justify-center gap-4">
      <Hint label={isPaused ? t("play") : t("pause")} asChild>
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

export default PauseControl;
