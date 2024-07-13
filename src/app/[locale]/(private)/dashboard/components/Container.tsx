import { cn } from "@/lib/utils";
import React, { FC } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Container: FC<ContainerProps> = ({ children, className }) => {
  return (
    <ScrollArea className="h-full w-full flex-1 py-4 lg:py-6">
      <div
        className={cn(
          "mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-y-5 overflow-hidden px-4 lg:px-6",
          className,
        )}
      >
        {children}
      </div>
    </ScrollArea>
  );
};

export default Container;
