import "@/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-xl font-bold text-primary">
        Welcome to Nativewind!
      </Text>
      <Link
        href="/onboarding"
        className="mt-4 p-4 bg-primary text-white rounded"
      >
        Go to Onboarding
      </Link>
      <Link href="/sign-in" className="mt-4 p-4 bg-primary text-white rounded">
        Go to Sign In
      </Link>
      <Link href="/sign-up" className="mt-4 p-4 bg-primary text-white rounded">
        Go to Sign Up
      </Link>
      <Link
        href="/subscriptions/spotify"
        className="mt-4 p-4 bg-primary text-white rounded"
      >
        Spotify Subscription
      </Link>
      <Link
        href={{
          pathname: "/subscriptions/[id]",
          params: { id: "claude" },
        }}
        className="mt-4 p-4 bg-primary text-white rounded"
      >
        Claude Max Subscription
      </Link>
    </SafeAreaView>
  );
}
