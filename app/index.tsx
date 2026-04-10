import "@/global.css";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold text-primary">
        Welcome to Nativewind!
      </Text>
      <Link
        href="/onboarding"
        className="mt-4 p-4 bg-primary text-white rounded"
      >
        Go to Onboarding
      </Link>
    </View>
  );
}
