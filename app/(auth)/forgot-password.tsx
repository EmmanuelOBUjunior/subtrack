import "@/global.css";
import { useAuthForgotPassword } from "@/hooks/useAuthForgotPassword";
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateVerificationCode,
} from "@/libs/validation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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

export default function ForgotPasswordScreen() {
  const {
    state,
    updateField,
    requestReset,
    verifyCode,
    resetPassword,
    resetFlow,
  } = useAuthForgotPassword();
  const [emailError, setEmailError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleEmailSubmit = async () => {
    const validation = validateEmail(state.email);
    if (!validation.valid) {
      setEmailError(validation.error || null);
      return;
    }

    Keyboard.dismiss();
    await requestReset(state.email);
  };

  const handleVerifyCode = async () => {
    const validation = validateVerificationCode(state.code);
    if (!validation.valid) {
      setCodeError(validation.error || null);
      return;
    }

    Keyboard.dismiss();
    await verifyCode(state.code);
  };

  const handleResetPassword = async () => {
    const passwordValidation = validatePassword(state.newPassword);
    const confirmValidation = validatePasswordMatch(
      state.newPassword,
      state.confirmPassword,
    );

    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.error || null);
      return;
    }

    if (!confirmValidation.valid) {
      setConfirmPasswordError(confirmValidation.error || null);
      return;
    }

    Keyboard.dismiss();
    await resetPassword(state.newPassword);
  };

  const isEmailFormValid = useMemo(() => {
    return validateEmail(state.email).valid && !state.isLoading;
  }, [state.email, state.isLoading]);

  const isCodeFormValid = useMemo(() => {
    return validateVerificationCode(state.code).valid && !state.isLoading;
  }, [state.code, state.isLoading]);

  const isPasswordFormValid = useMemo(() => {
    return (
      validatePassword(state.newPassword).valid &&
      validatePasswordMatch(state.newPassword, state.confirmPassword).valid &&
      !state.isLoading
    );
  }, [state.newPassword, state.confirmPassword, state.isLoading]);

  // Email Request Step
  if (state.step === "email") {
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
                <Pressable onPress={resetFlow} className="mb-4">
                  <Text className="text-accent font-sans-semibold text-sm">
                    ← Back
                  </Text>
                </Pressable>
                <Text className="font-sans-extrabold text-3xl text-foreground">
                  Reset Password
                </Text>
                <Text className="text-muted-foreground text-sm mt-2">
                  Enter your email address and we'll send you a code to reset
                  your password
                </Text>
              </View>

              <View className="gap-5 mb-6">
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
                    editable={!state.isLoading}
                  />
                  {emailError && (
                    <Text className="text-destructive text-xs font-sans-regular mt-2">
                      {emailError}
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
                className={`rounded-lg py-3 px-4 flex-row items-center justify-center ${
                  !isEmailFormValid ? "opacity-50" : ""
                }`}
                style={{ backgroundColor: "#081126" }}
                onPress={handleEmailSubmit}
                disabled={!isEmailFormValid}
              >
                {state.isLoading ? (
                  <ActivityIndicator color="#fff9e3" size="small" />
                ) : (
                  <Text className="text-card font-sans-semibold text-base">
                    Send Code
                  </Text>
                )}
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    );
  }

  // Verification Code Step
  if (state.step === "verify") {
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
                <Pressable onPress={resetFlow} className="mb-4">
                  <Text className="text-accent font-sans-semibold text-sm">
                    ← Back
                  </Text>
                </Pressable>
                <Text className="font-sans-extrabold text-2xl text-foreground mb-2">
                  Verify Code
                </Text>
                <Text className="text-muted-foreground text-sm">
                  We've sent a verification code to {state.email}
                </Text>
              </View>

              {state.success && (
                <View className="bg-success/10 rounded-lg p-3 mb-6 border border-success">
                  <Text className="text-success text-sm font-sans-medium">
                    {state.success}
                  </Text>
                </View>
              )}

              <View className="gap-5 mb-6">
                <View>
                  <Text className="font-sans-semibold text-sm text-foreground mb-2">
                    Verification Code
                  </Text>
                  <TextInput
                    className={`border rounded-lg px-4 py-3 font-sans-regular bg-card text-foreground text-center text-lg tracking-widest ${
                      codeError ? "border-destructive" : "border-border"
                    }`}
                    placeholder="000000"
                    placeholderTextColor="#999999"
                    maxLength={6}
                    keyboardType="number-pad"
                    value={state.code}
                    onChangeText={(val) => {
                      updateField("code", val);
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
                  !isCodeFormValid ? "opacity-50" : ""
                }`}
                style={{ backgroundColor: "#081126" }}
                onPress={handleVerifyCode}
                disabled={!isCodeFormValid}
              >
                {state.isLoading ? (
                  <ActivityIndicator color="#fff9e3" size="small" />
                ) : (
                  <Text className="text-card font-sans-semibold text-base">
                    Verify Code
                  </Text>
                )}
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    );
  }

  // Reset Password Step
  if (state.step === "reset") {
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
                <Text className="font-sans-extrabold text-2xl text-foreground mb-2">
                  Create New Password
                </Text>
                <Text className="text-muted-foreground text-sm">
                  Enter a strong password for your account
                </Text>
              </View>

              <View className="gap-5 mb-6">
                {/* New Password Field */}
                <View>
                  <Text className="font-sans-semibold text-sm text-foreground mb-2">
                    New Password
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
                      value={state.newPassword}
                      onChangeText={(val) => {
                        updateField("newPassword", val);
                        setPasswordError(null);
                      }}
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
                      editable={!state.isLoading}
                    />
                    <Pressable
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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

              {state.error && (
                <View className="bg-destructive/10 rounded-lg p-3 mb-6 border border-destructive">
                  <Text className="text-destructive text-sm font-sans-medium">
                    {state.error}
                  </Text>
                </View>
              )}

              {state.success && (
                <View className="bg-success/10 rounded-lg p-3 mb-6 border border-success">
                  <Text className="text-success text-sm font-sans-medium">
                    {state.success}
                  </Text>
                </View>
              )}

              <Pressable
                className={`rounded-lg py-3 px-4 flex-row items-center justify-center ${
                  !isPasswordFormValid ? "opacity-50" : ""
                }`}
                style={{ backgroundColor: "#081126" }}
                onPress={handleResetPassword}
                disabled={!isPasswordFormValid}
              >
                {state.isLoading ? (
                  <ActivityIndicator color="#fff9e3" size="small" />
                ) : (
                  <Text className="text-card font-sans-semibold text-base">
                    Reset Password
                  </Text>
                )}
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    );
  }

  return null;
}
