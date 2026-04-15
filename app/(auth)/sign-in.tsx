import "@/global.css";
import { useAuthSignIn } from "@/hooks/useAuthSignIn";
import {
  validateEmail,
  validatePassword,
  validateVerificationCode,
} from "@/libs/validation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function SignInScreen() {
  const {
    state,
    updateField,
    submitSignIn,
    verifyCode,
    resendCode,
    resetFlow,
  } = useAuthSignIn();
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Validate email on blur
  const handleEmailBlur = () => {
    const validation = validateEmail(state.email);
    setEmailError(validation.error || null);
  };

  // Validate password on blur
  const handlePasswordBlur = () => {
    const validation = validatePassword(state.password);
    setPasswordError(validation.error || null);
  };

  // Check if form is ready to submit
  const isFormValid = useMemo(() => {
    const emailValid = validateEmail(state.email).valid;
    const passwordValid = validatePassword(state.password).valid;
    return emailValid && passwordValid && !state.isLoading;
  }, [state.email, state.password, state.isLoading]);

  const handleSignIn = async () => {
    // Validate before submitting
    const emailValidation = validateEmail(state.email);
    const passwordValidation = validatePassword(state.password);

    if (!emailValidation.valid) {
      setEmailError(emailValidation.error || null);
      return;
    }

    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.error || null);
      return;
    }

    Keyboard.dismiss();
    const result = await submitSignIn(state.email, state.password);

    if (result === "needs_verification") {
      // Verification screen will be shown below
    }
  };

  const handleVerifyCode = async () => {
    const codeValidation = validateVerificationCode(state.verificationCode);

    if (!codeValidation.valid) {
      setCodeError(codeValidation.error || null);
      return;
    }

    Keyboard.dismiss();
    await verifyCode(state.verificationCode);
  };

  // Verification screen
  if (state.needsVerification) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
          >
            <ScrollView
              className="flex-1 p-5"
              contentContainerClassName="flex-grow justify-center"
              showsVerticalScrollIndicator={false}
            >
              <View className="mb-6">
                <Text className="font-sans-extrabold text-2xl text-foreground mb-2">
                  Verify your account
                </Text>
                <Text className="text-muted-foreground text-sm">
                  We've sent a verification code to {state.email}
                </Text>
              </View>

              <View className="gap-4 mb-6">
                <View>
                  <Text className="font-sans-semibold text-sm text-foreground mb-2">
                    Verification Code
                  </Text>
                  <TextInput
                    className="border border-border rounded-lg px-4 py-3 font-sans-regular bg-card text-foreground text-base"
                    placeholder="000000"
                    placeholderTextColor="#999999"
                    maxLength={6}
                    keyboardType="number-pad"
                    value={state.verificationCode}
                    onChangeText={(val) => {
                      updateField("verificationCode", val);
                      setCodeError(null);
                    }}
                    editable={!state.isLoading}
                  />
                  {codeError && (
                    <Text className="text-destructive text-xs font-sans-regular mt-2">
                      {codeError}
                    </Text>
                  )}
                </View>
              </View>

              {state.error && (
                <View className="bg-destructive/10 rounded-lg p-3 mb-6 border border-destructive">
                  <Text className="text-destructive text-sm font-sans-medium">
                    {state.error}
                  </Text>
                </View>
              )}

              <Pressable
                className={`rounded-lg py-3 px-4 flex-row items-center justify-center mb-3 ${
                  state.isLoading ? "opacity-50" : ""
                }`}
                style={{ backgroundColor: "#081126" }}
                onPress={handleVerifyCode}
                disabled={state.isLoading || !state.verificationCode.trim()}
              >
                {state.isLoading ? (
                  <ActivityIndicator color="#fff9e3" size="small" />
                ) : (
                  <Text className="text-card font-sans-semibold text-base">
                    Verify
                  </Text>
                )}
              </Pressable>

              <Pressable
                className="rounded-lg py-3 px-4 flex-row items-center justify-center border border-primary/20"
                onPress={resendCode}
                disabled={state.isLoading}
              >
                <Text className="text-primary font-sans-semibold text-base">
                  Resend Code
                </Text>
              </Pressable>

              <Pressable
                className="rounded-lg py-3 px-4 flex-row items-center justify-center mt-3"
                onPress={resetFlow}
                disabled={state.isLoading}
              >
                <Text className="text-muted-foreground font-sans-semibold text-base">
                  Start Over
                </Text>
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            className="flex-1 p-5"
            contentContainerClassName="flex-grow justify-center"
            showsVerticalScrollIndicator={false}
          >
            <View className="mb-8">
              <Text className="font-sans-extrabold text-3xl text-foreground">
                Sign In
              </Text>
              <Text className="text-muted-foreground text-sm mt-2">
                Welcome back! Sign in to access your subscriptions
              </Text>
            </View>

            <View className="gap-5 mb-6">
              {/* Email Field */}
              <View>
                <Text className="font-sans-semibold text-sm text-foreground mb-2">
                  Email Address
                </Text>
                <TextInput
                  className={`border rounded-lg px-4 py-3 font-sans-regular bg-card text-foreground text-base ${
                    emailError ? "border-destructive" : "border-border"
                  }`}
                  placeholder="you@example.com"
                  placeholderTextColor="#999999"
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  value={state.email}
                  onChangeText={(val) => {
                    updateField("email", val);
                    setEmailError(null);
                  }}
                  onBlur={handleEmailBlur}
                  editable={!state.isLoading}
                />
                {emailError && (
                  <Text className="text-destructive text-xs font-sans-regular mt-2">
                    {emailError}
                  </Text>
                )}
              </View>

              {/* Password Field */}
              <View>
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-sans-semibold text-sm text-foreground">
                    Password
                  </Text>
                  <Link href="/(auth)/forgot-password" asChild>
                    <Pressable>
                      <Text className="text-accent font-sans-semibold text-xs">
                        Forgot?
                      </Text>
                    </Pressable>
                  </Link>
                </View>
                <View
                  className={`flex-row items-center border rounded-lg px-4 py-3 bg-card ${
                    passwordError ? "border-destructive" : "border-border"
                  }`}
                >
                  <TextInput
                    className="flex-1 font-sans-regular text-foreground text-base"
                    placeholder="••••••••"
                    placeholderTextColor="#999999"
                    secureTextEntry={!showPassword}
                    value={state.password}
                    onChangeText={(val) => {
                      updateField("password", val);
                      setPasswordError(null);
                    }}
                    onBlur={handlePasswordBlur}
                    editable={!state.isLoading}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    disabled={state.isLoading}
                  >
                    <MaterialCommunityIcons
                      name={showPassword ? "eye" : "eye-off"}
                      size={20}
                      color="#999999"
                    />
                  </Pressable>
                </View>
                {passwordError && (
                  <Text className="text-destructive text-xs font-sans-regular mt-2">
                    {passwordError}
                  </Text>
                )}
              </View>
            </View>

            {/* Error Message */}
            {state.error && (
              <View className="bg-destructive/10 rounded-lg p-3 mb-6 border border-destructive">
                <Text className="text-destructive text-sm font-sans-medium">
                  {state.error}
                </Text>
              </View>
            )}

            {/* Sign In Button */}
            <Pressable
              className={`rounded-lg py-3 px-4 flex-row items-center justify-center mb-4 ${
                !isFormValid ? "opacity-50" : ""
              }`}
              style={{ backgroundColor: "#081126" }}
              onPress={handleSignIn}
              disabled={!isFormValid}
            >
              {state.isLoading ? (
                <ActivityIndicator color="#fff9e3" size="small" />
              ) : (
                <Text className="text-card font-sans-semibold text-base">
                  Continue
                </Text>
              )}
            </Pressable>

            {/* Sign Up Link */}
            <View className="flex-row items-center justify-center gap-1">
              <Text className="text-muted-foreground text-sm font-sans-regular">
                Don't have an account?
              </Text>
              <Link href="/(auth)/sign-up" asChild>
                <Pressable>
                  <Text className="text-accent font-sans-semibold text-sm">
                    Sign up
                  </Text>
                </Pressable>
              </Link>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
