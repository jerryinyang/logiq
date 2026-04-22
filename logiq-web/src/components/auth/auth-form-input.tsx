"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AuthFormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  showPasswordToggle?: boolean;
}

export const AuthFormInput = React.forwardRef<HTMLInputElement, AuthFormInputProps>(
  ({ className: _className, label, error, showPasswordToggle = false, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password" || showPasswordToggle;
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="space-y-2">
        <Label htmlFor={props.id || props.name}>{label}</Label>
        <div className="relative">
          <Input
            ref={ref}
            type={inputType}
            className={cn(
              "bg-background border-input pr-10",
              error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
            )}
            {...props}
          />
          {showPasswordToggle && isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

AuthFormInput.displayName = "AuthFormInput";