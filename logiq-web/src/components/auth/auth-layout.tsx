"use client";

import * as React from "react";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Link 
            href="/" 
            className="text-2xl font-bold text-foreground mb-2 hover:opacity-80 transition-opacity"
          >
            Logiq
          </Link>
          {description && (
            <p className="text-muted-foreground text-sm text-center">{description}</p>
          )}
        </div>
        <div className="bg-card rounded-xl border border-border p-6 sm:p-8">
          <h1 className="text-xl font-semibold text-foreground text-center mb-6">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
}