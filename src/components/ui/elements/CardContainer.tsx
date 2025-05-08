import { PropsWithChildren, type ReactNode } from "react";

import { Card } from "../common/Card";

interface CardContainerProps {
  heading: string;
  description: string;
  rightContent?: ReactNode;
}

const CardContainer = ({
  heading,
  description,
  children,
  rightContent,
}: PropsWithChildren<CardContainerProps>) => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="font-semibold tracking-wide">{heading}</h2>
          <p className="text-muted-foreground max-w-4xl text-sm">
            {description}
          </p>
        </div>
        {rightContent && <div>{rightContent}</div>}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </Card>
  );
};

export default CardContainer;
