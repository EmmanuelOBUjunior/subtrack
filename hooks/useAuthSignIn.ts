import { getClerkErrorMessage } from "@/libs/validation";
import { posthog } from "@/libs/posthog";
import { useSignIn } from "@clerk/expo";
import { type Href, useRouter } from "expo-router";
import { useState } from "react";

export interface SignInState {
  email: string;
  password: string;
  verificationCode: string;
  needsVerification: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuthSignIn = () => {
  const { signIn } = useSignIn();
  const router = useRouter();
  const [state, setState] = useState<SignInState>({
    email: "",
    password: "",
    verificationCode: "",
    needsVerification: false,
    isLoading: false,
    error: null,
  });

  const updateField = (
    field: keyof Omit<SignInState, "needsVerification" | "isLoading" | "error">,
    value: string,
  ) => {
    setState((prev) => ({ ...prev, [field]: value, error: null }));
  };

  const identifyAndCapture = (userId: string) => {
    posthog.identify(userId);
    posthog.capture("user_signed_in");
  };

  const submitSignIn = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const { error } = await signIn?.password({
        identifier: email,
        password,
      });

      if (error) {
        const errorMsg = getClerkErrorMessage(error);
        setState((prev) => ({ ...prev, error: errorMsg, isLoading: false }));
        return false;
      }

      if (signIn?.status === "complete") {
        const userId = signIn.createdSessionId ?? state.email;
        identifyAndCapture(userId);

        await signIn.finalize({
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
      } else if (signIn?.status === "needs_client_trust") {
        // MFA/verification needed
        const emailCodeFactor = signIn?.supportedSecondFactors.find(
          (factor) => factor.strategy === "email_code",
        );

        if (emailCodeFactor) {
          await signIn.mfa.sendEmailCode();
          setState((prev) => ({
            ...prev,
            needsVerification: true,
            isLoading: false,
          }));
          return "needs_verification";
        }
      } else if (signIn?.status === "needs_second_factor") {
        // Additional verification
        const emailCodeFactor = signIn?.supportedSecondFactors.find(
          (factor) => factor.strategy === "email_code",
        );

        if (emailCodeFactor) {
          await signIn.mfa.sendEmailCode();
          setState((prev) => ({
            ...prev,
            needsVerification: true,
            isLoading: false,
          }));
          return "needs_verification";
        }
      }

      return false;
    } catch (err) {
      const errorMsg = getClerkErrorMessage(err);
      setState((prev) => ({ ...prev, error: errorMsg, isLoading: false }));
      return false;
    }
  };

  const verifyCode = async (code: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await signIn?.mfa.verifyEmailCode({ code });

      if (signIn?.status === "complete") {
        const userId = signIn.createdSessionId ?? state.email;
        identifyAndCapture(userId);

        await signIn.finalize({
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
        throw new Error("Verification incomplete");
      }
    } catch (err) {
      const errorMsg = getClerkErrorMessage(err);
      setState((prev) => ({ ...prev, error: errorMsg, isLoading: false }));
      return false;
    }
  };

  const resendCode = async () => {
    try {
      await signIn?.mfa.sendEmailCode();
      setState((prev) => ({ ...prev, error: null }));
    } catch (err) {
      const errorMsg = getClerkErrorMessage(err);
      setState((prev) => ({ ...prev, error: errorMsg }));
    }
  };

  const resetFlow = () => {
    signIn?.reset();
    setState({
      email: "",
      password: "",
      verificationCode: "",
      needsVerification: false,
      isLoading: false,
      error: null,
    });
  };

  return {
    state,
    updateField,
    submitSignIn,
    verifyCode,
    resendCode,
    resetFlow,
  };
};
