"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthFormInput } from "@/components/auth/auth-form-input";
import { Button } from "@/components/ui/button";
import { validators, validateField } from "@/lib/validation";
import { showToast } from "@/lib/toast";
import { authApi } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [email, setEmail] = React.useState("");

  const validationRules = {
    email: [validators.required("Email is required"), validators.email("Please enter a valid email address")],
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
    
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handleBlur = () => {
    const error = validateField(email, validationRules.email);
    setErrors((prev) => ({ ...prev, email: error || "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateField(email, validationRules.email);
    if (error) {
      setErrors({ email: error });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authApi.forgotPassword(email);
      
      if (response.error) {
        showToast.error("Failed to send reset email", response.error);
        return;
      }
      
      showToast.success("Reset link sent!", "Check your email for password reset instructions.");
      router.push("/login");
    } catch {
      showToast.error("Failed to send reset email", "Please check the email address and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Forgot password" description="Enter your email to receive reset instructions">
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthFormInput
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="name@example.com"
          value={email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          autoComplete="email"
          required
        />

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send reset link"}
        </Button>

        <div className="flex items-center justify-center">
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}