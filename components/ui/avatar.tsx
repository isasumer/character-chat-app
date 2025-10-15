'use client';

import * as React from "react";
import { Avatar as AntAvatar } from "antd";
import type { AvatarProps as AntAvatarProps } from "antd";
import { cn } from "../../lib/utils";

interface AvatarProps extends Omit<AntAvatarProps, 'size'> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl" | number;
}

const sizeMap = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "md", ...props }, ref) => {
    // Get initials from fallback text
    const getInitials = (text?: string) => {
      if (!text) return "?";
      const words = text.trim().split(" ");
      if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
      }
      return text.substring(0, 2).toUpperCase();
    };

    const avatarSize = typeof size === 'number' ? size : sizeMap[size];

    return (
      <AntAvatar
        ref={ref}
        src={src}
        alt={alt}
        size={avatarSize}
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800",
          className
        )}
        style={{
          backgroundColor: !src ? 'linear-gradient(to bottom right, #7c3aed, #6d28d9)' : undefined,
        }}
        {...props}
      >
        {!src && (fallback || getInitials(alt))}
      </AntAvatar>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };

