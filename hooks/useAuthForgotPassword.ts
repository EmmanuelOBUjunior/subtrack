import { getClerkErrorMessage } from "@/libs/validation";
import { posthog } from "@/libs/posthog";
import { useSignIn } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useState } from "react";

export interface ForgotPasswordState {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
  step: "email" | "verify" | "reset";
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

export const useAuthForgotPassword = () => {
  const { signIn } = useSignIn();
  const router = useRouter();
  const [state, setState] = useState<ForgotPasswordState>({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
    step: "email",
    isLoading: false,
    error: null,
    success: null,
  });

  const updateField = (
    field: keyof Omit<
      ForgotPasswordState,
      "step" | "isLoading" | "error" | "success"
    >,
    value: string,
  ) => {
    setState((prev) => ({ ...prev, [field]: value, error: null }));
  };

  const requestReset = async (email: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await signIn?.create({
        strategy: "email_code",
        identifier: email,
      });

      posthog.capture("forgot_password_requested");

      setState((prev) => ({
        ...prev,
        email,
        step: "verify",
        isLoading: false,
        success: "Verification code sent to your email",
      }));
      return true;
    } catch (err) {
      const errorMsg = getClerkErrorMessage(err);
      setState((prev) => ({ ...prev, error: errorMsg, isLoading: false }));
      return false;
    }
  };

  const verifyCode = async (code: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await signIn?.attemptFirstFactor({
        strategy: "email_code",
        code,
      });

      setState((prev) => ({
        ...prev,
        code,
        step: "reset",
        isLoading: false,
      }));
      return true;
    } catch (err) {
      const errorMsg = getClerkErrorMessage(err);
      setState((prev) => ({ ...prev, error: errorMsg, isLoading: false }));
      return false;
    }
  };

  const resetPassword = async (newPassword: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await signIn?.resetPassword({
        password: newPassword,
      });

      posthog.capture("password_reset_completed");

      setState((prev) => ({
        ...prev,
        isLoading: false,
        success: "Password reset successfully. Redirecting to sign in...",
      }));

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/(auth)/sign-in");
      }, 1500);

      return true;
    } catch (err) {
      const errorMsg = getClerkErrorMessage(err);
      setState((prev) => ({ ...prev, error: errorMsg, isLoading: false }));
      return false;
    }
  };

  const resetFlow = () => {
    setState({
      email: "",
      code: "",
      newPassword: "",
      confirmPassword: "",
      step: "email",
      isLoading: false,
      error: null,
      success: null,
    });
  };

  return {
    state,
    updateField,
    requestReset,
    verifyCode,
    resetPassword,
    resetFlow,
  };
};
