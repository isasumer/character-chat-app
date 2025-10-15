'use client';

import * as React from "react";
import { Badge as AntBadge, Tag } from "antd";
import type { TagProps } from "antd";
import { cn } from "../../lib/utils";

export interface BadgeProps extends TagProps {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success";
}

function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const getColor = () => {
    switch (variant) {
      case "default":
        return "purple";
      case "secondary":
        return "default";
      case "destructive":
        return "red";
      case "success":
        return "green";
      case "outline":
        return undefined;
    }
  };

  return (
    <Tag
      color={getColor()}
      bordered={variant === "outline"}
      className={cn("rounded-full", className)}
      {...props}
    >
      {children}
    </Tag>
  );
}

export { Badge, AntBadge };

