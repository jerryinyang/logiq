export type ValidationRule<T = string> = {
  validate: (value: T) => boolean;
  message: string;
};

export type ValidationRules<T = string> = {
  [key: string]: ValidationRule<T>[];
};

export const validators = {
  required: (message = "This field is required"): ValidationRule => ({
    validate: (value: string) => value.trim().length > 0,
    message,
  }),

  email: (message = "Please enter a valid email address"): ValidationRule => ({
    validate: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value: string) => value.length >= min,
    message: message || `Must be at least ${min} characters`,
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    validate: (value: string) => value.length <= max,
    message: message || `Must be no more than ${max} characters`,
  }),

  password: (message = "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character"): ValidationRule => ({
    validate: (value: string) => {
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /\d/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const hasMinLength = value.length >= 8;
      return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasMinLength;
    },
    message,
  }),

  confirmPassword: (password: string, message = "Passwords do not match"): ValidationRule => ({
    validate: (value: string) => value === password,
    message,
  }),

  otp: (message = "Please enter a valid 6-digit OTP"): ValidationRule => ({
    validate: (value: string) => {
      const otpRegex = /^\d{6}$/;
      return otpRegex.test(value);
    },
    message,
  }),

  strongPassword: (message = "Password is too weak. Use at least 8 characters with a mix of letters and numbers"): ValidationRule => ({
    validate: (value: string) => {
      return value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);
    },
    message,
  }),
};

export interface ValidationError {
  field: string;
  message: string;
}

export function validateField(value: string, rules: ValidationRule[]): string | null {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      return rule.message;
    }
  }
  return null;
}

export function validateForm<T extends Record<string, string>>(
  data: T,
  rules: ValidationRules
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const field in rules) {
    const value = data[field] || "";
    const fieldRules = rules[field];
    const error = validateField(value, fieldRules);
    
    if (error) {
      errors.push({ field, message: error });
    }
  }

  return errors;
}