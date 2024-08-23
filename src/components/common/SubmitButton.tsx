"use client";

import { cn } from "@/lib/utils";
import React, { FC } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import Spinner from "@/components/common/Spinner";

interface SubmitButtonProps extends ButtonProps {
  className?: string;
  children: React.ReactNode;
  isPending?: boolean;
  disabled?: boolean;
  type?: "submit" | "button";
}

const SubmitButton: FC<SubmitButtonProps> = ({
  className,
  children,
  isPending,
  disabled,
  type = "submit",
  ...props
}) => {
  return (
    <Button
      type={type}
      disabled={disabled || isPending}
      className={cn("flex items-center gap-x-2", className)}
      {...props}
    >
      {children}
      {isPending && <Spinner />}
    </Button>
  );
};

export default SubmitButton;
