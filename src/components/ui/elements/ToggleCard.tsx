import { PropsWithChildren } from "react";

import { Skeleton } from "../common/Skeleton";
import { Switch } from "../common/Switch";

import CardContainer from "./CardContainer";

interface ToggleCardProps {
  heading: string;
  description: string;
  isDisabled?: boolean;
  value: boolean;
  onChange: (value: boolean) => void;
}

const ToggleCard = ({
  description,
  heading,
  isDisabled,
  onChange,
  value,
  children,
}: PropsWithChildren<ToggleCardProps>) => {
  return (
    <CardContainer
      heading={heading}
      description={description}
      children={children}
      rightContent={
        <Switch
          checked={value}
          onCheckedChange={onChange}
          disabled={isDisabled}
        />
      }
    />
  );
};

export function ToggleCardSkeleton() {
  return <Skeleton className="mt-6 h-20 w-full" />;
}

export default ToggleCard;
