import { Volume1, Volume2, VolumeX } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/common/Button";
import { Slider } from "@/components/ui/common/Slider";
import Hint from "@/components/ui/elements/Hint";

interface VolumeControlProps {
  onToggle: () => void;
  onChange: (value: number) => void;
  value: number;
}

const VolumeControl = ({ onChange, onToggle, value }: VolumeControlProps) => {
  const t = useTranslations("stream.video.player");

  const isMuted = value === 0;
  const isAboveHalf = value > 50;

  let Icon = Volume1;
  if (isMuted) {
    Icon = VolumeX;
  } else if (isAboveHalf) {
    Icon = Volume2;
  }

  const handleChange = (value: number[]) => {
    onChange(value[0]);
  };
  return (
    <div className="flex items-center gap-1">
      <Hint label={t("volume")} asChild>
        <Button
          className="text-white hover:bg-white/10"
          variant="ghost"
          size="icon"
          onClick={onToggle}
        >
          <Icon className="size-6" />
        </Button>
      </Hint>
      <Slider
        className="w-32 cursor-pointer"
        onValueChange={handleChange}
        value={[value]}
        max={100}
        step={1}
      />
    </div>
  );
};

export default VolumeControl;
