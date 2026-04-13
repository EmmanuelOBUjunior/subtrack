import "@/global.css";
import { useAuthSignUp } from "@/hooks/useAuthSignUp";
import {
    validateEmail,
    validatePassword,
    validatePasswordMatch,
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

export default function SignUpScreen() {
  const { state, updateField, submitSignUp, verifyEmail, resetCode } =
    useAuthSignUp();
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  // Validate confirm password on blur
  const handleConfirmPasswordBlur = () => {
    if (state.confirmPassword) {
      const validation = validatePasswordMatch(
        state.password,
        state.confirmPassword,
      );
      setConfirmPasswordError(validation.error || null);
    }
  };

  // Check if form is ready to submit
  const isFormValid = useMemo(() => {
    const emailValid = validateEmail(state.email).valid;
    const passwordValid = validatePassword(state.password).valid;
    const passwordsMatch = validatePasswordMatch(
      state.password,
      state.confirmPassword,
    ).valid;
    return emailValid && passwordValid && passwordsMatch && !state.isLoading;
  }, [state.email, state.password, state.confirmPassword, state.isLoading]);

  const handleSignUp = async () => {
    // Validate all fields before submitting
    const emailValidation = validateEmail(state.email);
    const passwordValidation = validatePassword(state.password);
    const passwordMatchValidation = validatePasswordMatch(
      state.password,
      state.confirmPassword,
    );

    if (!emailValidation.valid) {
      setEmailError(emailValidation.error || null);
      return;
    }

    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.error || null);
      return;
    }

    if (!passwordMatchValidation.valid) {
      setConfirmPasswordError(passwordMatchValidation.error || null);
      return;
    }

    Keyboard.dismiss();
    await submitSignUp(state.email, state.password);
  };

  const handleVerifyCode = async () => {
    const codeValidation = validateVerificationCode(state.verificationCode);

    if (!codeValidation.valid) {
      setCodeError(codeValidation.error || null);
      return;
    }

    Keyboard.dismiss();
    await verifyEmail(state.verificationCode);
  };

  // Verification screen
  if (state.pendingVerification) {
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
                  Verify your email
                </Text>
                <Text className="text-muted-foreground text-sm">
                  We've sent a verification code to {state.email}. Enter it
                  below to complete your account setup.
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
                    Verify Email
                  </Text>
                )}
              </Pressable>

              <Pressable
                className="rounded-lg py-3 px-4 flex-row items-center justify-center border border-primary/20"
                onPress={resetCode}
                disabled={state.isLoading}
              >
                <Text className="text-primary font-sans-semibold text-base">
                  Resend Code
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
            contentContainerClassName="flex-grow justify-center pb-10"
            showsVerticalScrollIndicator={false}
          >
            <View className="mb-8">
              <Text className="font-sans-extrabold text-3xl text-foreground">
                Create Account
              </Text>
              <Text className="text-muted-foreground text-sm mt-2">
                Get started and manage all your subscriptions in one place
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
                <Text className="font-sans-semibold text-sm text-foreground mb-2">
                  Password
                </Text>
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
                <Text className="text-muted-foreground text-xs font-sans-regular mt-2">
                  Must be at least 8 characters with uppercase, lowercase, and
                  number
                </Text>
              </View>

              {/* Confirm Password Field */}
              <View>
                <Text className="font-sans-semibold text-sm text-foreground mb-2">
                  Confirm Password
                </Text>
                <View
                  className={`flex-row items-center border rounded-lg px-4 py-3 bg-card ${
                    confirmPasswordError
                      ? "border-destructive"
                      : "border-border"
                  }`}
                >
                  <TextInput
                    className="flex-1 font-sans-regular text-foreground text-base"
                    placeholder="••••••••"
                    placeholderTextColor="#999999"
                    secureTextEntry={!showConfirmPassword}
                    value={state.confirmPassword}
                    onChangeText={(val) => {
                      updateField("confirmPassword", val);
                      setConfirmPasswordError(null);
                    }}
                    onBlur={handleConfirmPasswordBlur}
                    editable={!state.isLoading}
                  />
                  <Pressable
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={state.isLoading}
                  >
                    <MaterialCommunityIcons
                      name={showConfirmPassword ? "eye" : "eye-off"}
                      size={20}
                      color="#999999"
                    />
                  </Pressable>
                </View>
                {confirmPasswordError && (
                  <Text className="text-destructive text-xs font-sans-regular mt-2">
                    {confirmPasswordError}
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

            {/* Sign Up Button */}
            <Pressable
              className={`rounded-lg py-3 px-4 flex-row items-center justify-center mb-4 ${
                !isFormValid ? "opacity-50" : ""
              }`}
              style={{ backgroundColor: "#081126" }}
              onPress={handleSignUp}
              disabled={!isFormValid}
            >
              {state.isLoading ? (
                <ActivityIndicator color="#fff9e3" size="small" />
              ) : (
                <Text className="text-card font-sans-semibold text-base">
                  Create Account
                </Text>
              )}
            </Pressable>

            {/* Sign In Link */}
            <View className="flex-row items-center justify-center gap-1">
              <Text className="text-muted-foreground text-sm font-sans-regular">
                Already have an account?
              </Text>
              <Link href="/(auth)/sign-in" asChild>
                <Pressable>
                  <Text className="text-accent font-sans-semibold text-sm">
                    Sign in
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
