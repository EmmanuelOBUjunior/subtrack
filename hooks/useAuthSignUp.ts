import { getClerkErrorMessage } from "@/libs/validation";
import { posthog } from "@/libs/posthog";
import { useAuth, useSignUp } from "@clerk/expo";
import { type Href, useRouter } from "expo-router";
import { useState } from "react";

export interface SignUpState {
  email: string;
  password: string;
  confirmPassword: string;
  verificationCode: string;
  pendingVerification: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuthSignUp = () => {
  const { signUp } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [state, setState] = useState<SignUpState>({
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
    pendingVerification: false,
    isLoading: false,
    error: null,
  });

  const updateField = (
    field: keyof Omit<
      SignUpState,
      "pendingVerification" | "isLoading" | "error"
    >,
    value: string,
  ) => {
    setState((prev) => ({ ...prev, [field]: value, error: null }));
  };

  const submitSignUp = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const { error } = await signUp?.password({
        emailAddress: email,
        password,
      });

      if (error) {
        const errorMsg = getClerkErrorMessage(error);
        setState((prev) => ({ ...prev, error: errorMsg, isLoading: false }));
        return false;
      }

      // Send verification email
      await signUp?.verifications.sendEmailCode();
      setState((prev) => ({
        ...prev,
        pendingVerification: true,
        isLoading: false,
      }));
      return true;
    } catch (err) {
      const errorMsg = getClerkErrorMessage(err);
      setState((prev) => ({ ...prev, error: errorMsg, isLoading: false }));
      return false;
    }
  };

  const verifyEmail = async (code: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await signUp?.verifications.verifyEmailCode({ code });

      // Complete sign-up and finalize session
      if (signUp?.status === "complete") {
        const userId = signUp.createdUserId ?? state.email;

        posthog.identify(userId, {
          $set_once: {
            first_sign_up_date: new Date().toISOString(),
          },
        });
        posthog.capture("user_signed_up");

        await signUp.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log("Session task:", session.currentTask);
              return;
            }

            const url = decorateUrl("/(tabs)");
            if (!url.startsWith("http")) {
              router.push(url as Href);
            }
          },
        });

        return true;
      } else {
        throw new Error("Sign-up verification incomplete");
      }
    } catch (err) {
      const errorMsg = getClerkErrorMessage(err);
      setState((prev) => ({ ...prev, error: errorMsg, isLoading: false }));
      return false;
    }
  };

  const resetCode = async () => {
    try {
      await signUp?.verifications.sendEmailCode();
      setState((prev) => ({ ...prev, error: null }));
    } catch (err) {
      const errorMsg = getClerkErrorMessage(err);
      setState((prev) => ({ ...prev, error: errorMsg }));
    }
  };

  return {
    state,
    updateField,
    submitSignUp,
    verifyEmail,
    resetCode,
    isSignedIn,
  };
};
