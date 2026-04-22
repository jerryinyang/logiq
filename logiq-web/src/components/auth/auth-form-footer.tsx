"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AuthFormFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthFormFooter({ children, className }: AuthFormFooterProps) {
  return (
    <div className={cn("text-center text-sm text-muted-foreground mt-6", className)}>
      {children}
    </div>
  );
}

interface AuthLinkProps {
  text: string;
  linkText: string;
  href: string;
}

export function AuthLink({ text, linkText, href }: AuthLinkProps) {
  return (
    <p className="text-center text-sm text-muted-foreground">
      {text}{" "}
      <Link 
        href={href} 
        className="text-primary font-medium hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
      >
        {linkText}
      </Link>
    </p>
  );
}

export function AuthDivider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-card px-2 text-muted-foreground">
          Or
        </span>
      </div>
    </div>
  );
}