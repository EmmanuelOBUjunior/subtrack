import SubscriptionCard from "@/components/subscription-card";
import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { styled } from "nativewind";
import React, { useMemo, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Subscription = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredSubscriptions = useMemo(() => {
    if (!searchQuery.trim()) {
      return HOME_SUBSCRIPTIONS;
    }

    const query = searchQuery.toLowerCase();
    return HOME_SUBSCRIPTIONS.filter(
      (subscription) =>
        subscription.name.toLowerCase().includes(query) ||
        subscription.category?.toLowerCase().includes(query) ||
        subscription.plan?.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-5 pt-5">
        <View className="mb-5">
          <Text className="text-lg font-semibold mb-3">Subscriptions</Text>
          <TextInput
            placeholder="Search subscriptions..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="border border-gray-300 rounded-lg px-4 py-3 text-base"
          />
        </View>

        <FlatList
          data={filteredSubscriptions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="mb-4">
              <SubscriptionCard
                {...item}
                expanded={expandedId === item.id}
                onPress={() =>
                  setExpandedId(expandedId === item.id ? null : item.id)
                }
              />
            </View>
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-10">
              <Text className="text-gray-500">No subscriptions found</Text>
            </View>
          }
          scrollEnabled={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default Subscription;
