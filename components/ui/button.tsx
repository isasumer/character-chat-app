'use client';

import * as React from "react";
import { Button as AntButton } from "antd";
import type { ButtonProps as AntButtonProps } from "antd";
import { cn } from "../../lib/utils";

export interface ButtonProps extends Omit<AntButtonProps, 'type' | 'variant'> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "middle", loading, children, ...props }, ref) => {
    // Map variant to Ant Design button types
    const getButtonType = (): AntButtonProps['type'] => {
      switch (variant) {
        case "default":
          return "primary";
        case "destructive":
          return "primary";
        case "outline":
          return "default";
        case "ghost":
        case "link":
          return "link";
        case "secondary":
        default:
          return "default";
      }
    };

    const getDanger = () => variant === "destructive";

    return (
      <AntButton
        ref={ref}
        type={getButtonType()}
        size={size}
        loading={loading}
        danger={getDanger()}
        className={cn(
          variant === "ghost" && "hover:bg-gray-100 dark:hover:bg-gray-800",
          className
        )}
        {...props}
      >
        {children}
      </AntButton>
    );
  }
);
Button.displayName = "Button";

export { Button };

