'use client';

import * as React from "react";
import { Input as AntInput } from "antd";
import type { InputProps as AntInputProps, InputRef } from "antd";
import { cn } from "../../lib/utils";

export interface InputProps extends AntInputProps {
  error?: boolean;
}

const Input = React.forwardRef<InputRef, InputProps>(
  ({ className, error, status, ...props }, ref) => {
    return (
      <AntInput
        ref={ref}
        status={error ? "error" : status}
        className={cn(className)}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

