import { toast } from "sonner";

export type ToastType = "success" | "error" | "warning" | "info";

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 4000,
    });
  },
  
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 5000,
    });
  },
  
  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 4000,
    });
  },
  
  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 4000,
    });
  },
  
  loading: (message: string, description?: string) => {
    return toast.loading(message, {
      description,
    });
  },
  
  dismiss: () => {
    toast.dismiss();
  },
};

export const authToasts = {
  loginSuccess: () => {
    showToast.success("Welcome back!", "You have successfully logged in.");
  },
  
  loginError: (message = "Invalid email or password") => {
    showToast.error("Login Failed", message);
  },
  
  registerSuccess: () => {
    showToast.success("Account created!", "Please check your email to verify your account.");
  },
  
  registerError: (message = "Registration failed. Please try again.") => {
    showToast.error("Registration Failed", message);
  },
  
  passwordResetSent: () => {
    showToast.success("Reset link sent!", "Check your email for password reset instructions.");
  },
  
  passwordResetError: (message = "Failed to send reset email. Please try again.") => {
    showToast.error("Reset Failed", message);
  },
  
  passwordResetSuccess: () => {
    showToast.success("Password reset!", "Your password has been successfully reset.");
  },
  
  passwordResetInvalid: () => {
    showToast.error("Invalid or expired link", "Please request a new password reset.");
  },
  
  otpSent: () => {
    showToast.success("OTP sent!", "Check your email for the verification code.");
  },
  
  otpError: (message = "Failed to send OTP. Please try again.") => {
    showToast.error("OTP Failed", message);
  },
  
  otpVerified: () => {
    showToast.success("Email verified!", "Your email has been successfully verified.");
  },
  
  otpInvalid: () => {
    showToast.error("Invalid OTP", "Please enter the correct 6-digit code.");
  },
  
  otpExpired: () => {
    showToast.warning("OTP expired", "Please request a new verification code.");
  },
  
  validationError: (field: string, message: string) => {
    showToast.error(field, message);
  },
};