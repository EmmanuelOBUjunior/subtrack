import { icons } from "@/constants/icons";
import "@/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Onboarding = () => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-5 pt-12 pb-10 justify-between">
        {/* Header with logo */}
        <View className="auth-brand-block">
          <View className="auth-logo-wrap">
            <View className="auth-logo-mark">
              <Text className="auth-logo-mark-text">S</Text>
            </View>
            <View>
              <Text className="auth-wordmark">Subtrack</Text>
              <Text className="auth-wordmark-sub">Subscription Manager</Text>
            </View>
          </View>
        </View>

        {/* Content section */}
        <View className="items-center">
          {/* Large icon */}
          <View className="mb-8 w-24 h-24 items-center justify-center">
            <Image source={icons.wallet} className="w-full h-full" />
          </View>

          {/* Title */}
          <Text className="auth-title text-center mb-4">
            Manage Your Subscriptions
          </Text>

          {/* Description */}
          <Text className="text-center text-base font-sans-medium text-muted-foreground mb-2">
            Keep track of all your subscriptions in one place
          </Text>

          {/* Features list */}
          <View className="mt-8 w-full">
            <View className="mb-4 flex-row items-start">
              <Text className="text-accent font-sans-bold mr-3">✓</Text>
              <Text className="flex-1 text-sm font-sans-medium text-primary">
                Monitor spending across all subscriptions
              </Text>
            </View>
            <View className="mb-4 flex-row items-start">
              <Text className="text-accent font-sans-bold mr-3">✓</Text>
              <Text className="flex-1 text-sm font-sans-medium text-primary">
                Get insights with spending trends and analytics
              </Text>
            </View>
            <View className="flex-row items-start">
              <Text className="text-accent font-sans-bold mr-3">✓</Text>
              <Text className="flex-1 text-sm font-sans-medium text-primary">
                Never miss a renewal with smart notifications
              </Text>
            </View>
          </View>
        </View>

        {/* CTA Buttons */}
        <View className="gap-3">
          <Link href="/sign-in" asChild>
            <Pressable className="auth-button">
              <Text className="auth-button-text">Get Started</Text>
            </Pressable>
          </Link>
          <Link href="/sign-up" asChild>
            <Pressable className="auth-secondary-button">
              <Text className="auth-secondary-button-text">Create Account</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;
