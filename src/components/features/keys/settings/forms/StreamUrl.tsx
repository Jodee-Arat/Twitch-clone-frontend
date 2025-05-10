import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/common/input";
import CardContainer from "@/components/ui/elements/CardContainer";
import CopyButton from "@/components/ui/elements/CopyButton";

interface StreamUrlProps {
  value: string | null;
}
const StreamURL = ({ value }: StreamUrlProps) => {
  const t = useTranslations("dashboard.keys.url");
  return (
    <CardContainer heading={t("heading")}>
      <div className="flex w-full items-center gap-x-4">
        <Input value={value ?? ""} placeholder={t("heading")} disabled />
        <CopyButton value={value} />
      </div>
    </CardContainer>
  );
};

export default StreamURL;
