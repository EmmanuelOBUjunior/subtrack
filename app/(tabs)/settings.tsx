import "@/global.css";
import { posthog } from "@/libs/posthog";
import { useClerk, useUser } from "@clerk/expo";
import { styled } from "nativewind";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isLoading, setIsLoading] = useState(false);

  const displayName =
    user?.firstName || user?.emailAddresses[0]?.emailAddress || "User";
  const userEmail = user?.emailAddresses[0]?.emailAddress || "";
  const userInitial = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Sign Out",
        onPress: async () => {
          setIsLoading(true);
          try {
            posthog.capture("user_signed_out");
            posthog.reset();
            await signOut();
          } catch (error) {
            console.error("Sign out error:", error);
            setIsLoading(false);
          }
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-8">
          <Text className="font-sans-extrabold text-3xl text-foreground">
            Settings
          </Text>
        </View>

        {/* Profile Section */}
        <View className="bg-card rounded-lg p-4 mb-6 border border-border">
          <Text className="font-sans-semibold text-sm text-muted-foreground mb-3">
            PROFILE
          </Text>
          <View className="flex-row items-center gap-4">
            {user?.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                className="w-16 h-16 rounded-full bg-muted"
              />
            ) : (
              <View className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
                <Text className="font-sans-bold text-2xl text-card">
                  {userInitial}
                </Text>
              </View>
            )}
            <View className="flex-1">
              <Text className="font-sans-semibold text-base text-foreground mb-1">
                {displayName}
              </Text>
              <Text className="font-sans-regular text-sm text-muted-foreground">
                {userEmail}
              </Text>
            </View>
          </View>
        </View>

        {/* App Section */}
        <View className="mb-6">
          <Text className="font-sans-semibold text-sm text-muted-foreground mb-3">
            APP
          </Text>
          <View className="bg-card rounded-lg border border-border overflow-hidden">
            <Pressable className="px-4 py-3 border-b border-border">
              <Text className="font-sans-regular text-base text-foreground">
                About
              </Text>
            </Pressable>
            <Pressable className="px-4 py-3 border-b border-border">
              <Text className="font-sans-regular text-base text-foreground">
                Privacy Policy
              </Text>
            </Pressable>
            <Pressable className="px-4 py-3">
              <Text className="font-sans-regular text-base text-foreground">
                Terms of Service
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Account Section */}
        <View className="mb-20">
          <Text className="font-sans-semibold text-sm text-muted-foreground mb-3">
            ACCOUNT
          </Text>
          <Pressable
            className="bg-card rounded-lg px-4 py-3 border border-border"
            onPress={handleLogout}
            disabled={isLoading}
          >
            <View className="flex-row items-center justify-between">
              <Text className="font-sans-regular text-base text-destructive">
                Sign Out
              </Text>
              {isLoading && <ActivityIndicator color="#dc2626" size="small" />}
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
