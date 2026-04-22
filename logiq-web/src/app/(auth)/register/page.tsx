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
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordRequirement {
  test: (value: string) => boolean;
  label: string;
}

const passwordRequirements: PasswordRequirement[] = [
  { test: (p) => p.length >= 8, label: "At least 8 characters" },
  { test: (p) => /[A-Z]/.test(p), label: "One uppercase letter" },
  { test: (p) => /[a-z]/.test(p), label: "One lowercase letter" },
  { test: (p) => /\d/.test(p), label: "One number" },
  { test: (p) => /[!@#$%^&*(),.?\":{}|<>]/.test(p), label: "One special character" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [showPasswordRequirements, setShowPasswordRequirements] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validationRules = {
    name: [validators.required("Name is required"), validators.minLength(2, "Name must be at least 2 characters")],
    email: [validators.required("Email is required"), validators.email("Please enter a valid email address")],
    password: [validators.required("Password is required"), validators.password()],
    confirmPassword: [
      validators.required("Please confirm your password"),
      validators.confirmPassword(formData.password, "Passwords do not match"),
    ],
  };

  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    passwordRequirements.forEach((req) => {
      if (req.test(password)) strength++;
    });
    return strength;
  };

  const _passwordStrength = getPasswordStrength(formData.password);

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

    if (name === "password") {
      setShowPasswordRequirements(false);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.name === "password") {
      setShowPasswordRequirements(true);
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
      const response = await authApi.register(formData.name, formData.email, formData.password);
      
      if (response.error) {
        showToast.error("Registration Failed", response.error);
        return;
      }
      
      showToast.success("Account created!", "Please check your email to verify your account.");
      router.push("/login");
    } catch {
      showToast.error("Registration Failed", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create an account" description="Start your journey with Logiq">
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthFormInput
          id="name"
          name="name"
          type="text"
          label="Full Name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
          autoComplete="name"
          required
        />

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

        <div className="space-y-2">
          <AuthFormInput
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            error={errors.password}
            showPasswordToggle
            autoComplete="new-password"
            required
          />
          
          {showPasswordRequirements && (
            <div className="space-y-1 p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">Password requirements:</p>
              <div className="grid grid-cols-1 gap-1">
                {passwordRequirements.map((req, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "flex items-center gap-2 text-xs",
                      req.test(formData.password) ? "text-success" : "text-muted-foreground"
                    )}
                  >
                    {req.test(formData.password) ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    {req.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <AuthFormInput
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.confirmPassword}
          showPasswordToggle
          autoComplete="new-password"
          required
        />

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create account"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link 
            href="/login" 
            className="text-primary font-medium hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}