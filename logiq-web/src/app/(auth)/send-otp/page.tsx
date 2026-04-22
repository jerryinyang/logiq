"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { validators, validateField } from "@/lib/validation";
import { showToast } from "@/lib/toast";
import { authApi } from "@/lib/auth";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Suspense } from "react";

function SendOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const [isLoading, setIsLoading] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [countdown, setCountdown] = React.useState(email ? 60 : 0);
  const [otp, setOtp] = React.useState(["", "", "", "", "", ""]);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (errors.otp) {
      setErrors((prev) => ({ ...prev, otp: "" }));
    }

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    
    const lastFilledIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleResend = async () => {
    if (countdown > 0 || isResending || !email) return;
    
    setIsResending(true);
    try {
      const response = await authApi.resendOtp(email);
      
      if (response.error) {
        showToast.error("Failed to resend OTP", response.error);
        return;
      }
      
      showToast.success("OTP sent!", "Check your email for the new verification code.");
      setCountdown(60);
    } catch {
      showToast.error("Failed to resend OTP", "Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpValue = otp.join("");
    const error = validateField(otpValue, [validators.otp()]);
    
    if (error) {
      setErrors({ otp: error });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authApi.verifyOtp(email, otp.join(""));
      
      if (response.error) {
        showToast.error("Invalid OTP", response.error);
        return;
      }
      
      showToast.success("Email verified!", "Your email has been successfully verified.");
      router.push("/login");
    } catch {
      showToast.error("Invalid OTP", "Please enter the correct 6-digit code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Verify your email" 
      description={email ? `Enter the 6-digit code sent to ${email}` : "Enter the 6-digit code from your email"}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Verification Code</label>
          <div className="flex gap-2 justify-between" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-full h-12 text-center text-lg font-semibold bg-background border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                style={{
                  borderColor: errors.otp ? "var(--destructive)" : "var(--input)",
                }}
              />
            ))}
          </div>
          {errors.otp && (
            <p className="text-xs text-destructive">{errors.otp}</p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || otp.join("").length !== 6}
        >
          {isLoading ? "Verifying..." : "Verify"}
        </Button>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the code?
          </p>
          {countdown > 0 ? (
            <p className="text-sm text-muted-foreground">
              Resend in <span className="text-primary font-medium">{countdown}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-sm text-primary font-medium hover:text-primary/80 transition-colors underline-offset-4 hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
            >
              <RefreshCw className={`h-4 w-4 ${isResending ? "animate-spin" : ""}`} />
              Resend code
            </button>
          )}
        </div>

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

export default function SendOtpPage() {
  return (
    <Suspense fallback={<AuthLayout title="Loading..."><div className="text-center text-muted-foreground">Loading...</div></AuthLayout>}>
      <SendOtpForm />
    </Suspense>
  );
}