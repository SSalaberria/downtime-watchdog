"use client";

import * as React from "react";
import { twMerge } from "tailwind-merge";

type Variant = "primary" | "secondary";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-secondary text-white border hover:bg-primary/90 hover:text-primary-foreground",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, loading, variant, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={twMerge(
          "ring-offset-background inline-flex w-full items-center justify-center rounded-md bg-primary p-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant || "primary"],
          className,
        )}
        disabled={props.disabled || loading}
        {...props}
      >
        {loading && (
          <div className="mr-1" role="status">
            <div className="border-background h-3 w-3 animate-spin rounded-full border-2 border-r-transparent" />
            <span className="sr-only">Loading...</span>
          </div>
        )}
        {props.children}
      </button>
    );
  },
);
Button.displayName = "Button";
