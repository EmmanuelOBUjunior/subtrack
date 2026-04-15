/**
 * Email validation utility
 * Validates email format according to common standards
 */
export const validateEmail = (
  email: string,
): { valid: boolean; error?: string } => {
  if (!email) {
    return { valid: false, error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Please enter a valid email address" };
  }

  return { valid: true };
};

/**
 * Password validation utility
 * Requires minimum 8 characters, at least one uppercase, one lowercase, and one number
 */
export const validatePassword = (
  password: string,
): { valid: boolean; error?: string } => {
  if (!password) {
    return { valid: false, error: "Password is required" };
  }

  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters" };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain an uppercase letter" };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must contain a lowercase letter" };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain a number" };
  }

  return { valid: true };
};

/**
 * Confirmation password validation
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string,
): { valid: boolean; error?: string } => {
  if (!confirmPassword) {
    return { valid: false, error: "Please confirm your password" };
  }

  if (password !== confirmPassword) {
    return { valid: false, error: "Passwords do not match" };
  }

  return { valid: true };
};

/**
 * Verification code validation
 */
export const validateVerificationCode = (
  code: string,
): { valid: boolean; error?: string } => {
  if (!code) {
    return { valid: false, error: "Verification code is required" };
  }

  if (!/^\d{6}$/.test(code.trim())) {
    return { valid: false, error: "Verification code must be 6 digits" };
  }

  return { valid: true };
};

/**
 * Extract user-friendly error message from Clerk error
 */
export const getClerkErrorMessage = (error: any): string => {
  if (!error) return "An error occurred. Please try again.";

  // Handle Clerk-specific errors
  if (error.errors && error.errors[0]) {
    const clerkError = error.errors[0];
    const message = clerkError.message || clerkError.code;

    // Map common Clerk error codes to friendly messages
    const errorMap: Record<string, string> = {
      form_password_pwned:
        "This password is too common. Please choose a different one.",
      form_param_nil: "Please fill in all fields.",
      form_identifier_not_found: "Email not found. Please check and try again.",
      form_invalid_password: "Incorrect password. Please try again.",
      identification_exists: "An account with this email already exists.",
      form_password_length: "Password must be at least 8 characters.",
      form_verification_code_incorrect:
        "Verification code is incorrect. Please try again.",
    };

    return errorMap[message] || message;
  }

  if (typeof error === "string") return error;
  if (error.message) return error.message;

  return "An error occurred. Please try again.";
};
