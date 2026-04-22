"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthFormInput } from "@/components/auth/auth-form-input";
import { AuthDivider } from "@/components/auth/auth-form-footer";
import { Button } from "@/components/ui/button";
import { validators, validateField } from "@/lib/validation";
import { showToast } from "@/lib/toast";
import { authApi } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const validationRules = {
    email: [validators.required(), validators.email()],
    password: [validators.required()],
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldRules = validationRules[name as keyof typeof validationRules];
    if (fieldRules) {
      const error = validateField(value, fieldRules);
      setErrors((prev) => ({ ...prev, [name]: error || "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    for (const field in validationRules) {
      const error = validateField(formData[field as keyof typeof formData], validationRules[field as keyof typeof validationRules]);
      if (error) {
        newErrors[field] = error;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authApi.login(formData.email, formData.password);
      
      if (response.error) {
        showToast.error("Login Failed", response.error);
        return;
      }
      
      if (response.token) {
        localStorage.setItem("auth_token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
      }
      
      showToast.success("Welcome back!", "You have successfully logged in.");
      router.push("/dashboard");
    } catch {
      showToast.error("Login Failed", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" description="Enter your credentials to access your account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthFormInput
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="name@example.com"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          autoComplete="email"
          required
        />

        <AuthFormInput
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
          showPasswordToggle
          autoComplete="current-password"
          required
        />

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>

        <AuthDivider />

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link 
            href="/register" 
            className="text-primary font-medium hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}