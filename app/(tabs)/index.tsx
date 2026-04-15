import ListHeading from "@/components/list-heading";
import SubscriptionCard from "@/components/subscription-card";
import UpcomingSubscriptionCard from "@/components/upcoming-subscription-card";
import {
  HOME_BALANCE,
  HOME_SUBSCRIPTIONS,
  UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";
import { icons } from "@/constants/icons";
import "@/global.css";
import { posthog } from "@/libs/posthog";
import { formatCurrency } from "@/libs/utils";
import { useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const { user } = useUser();
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);

  const displayName =
    user?.firstName || user?.emailAddresses[0]?.emailAddress || "User";
  const userInitial = displayName.charAt(0).toUpperCase();

  const handleSubscriptionPress = (id: string, name: string) => {
    setExpandedSubscriptionId((currentId) => {
      const isExpanding = currentId !== id;
      if (isExpanding) {
        posthog.capture("subscription_card_expanded", {
          subscription_id: id,
          subscription_name: name,
        });
      }
      return isExpanding ? id : null;
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user">
                {user?.imageUrl ? (
                  <Image
                    source={{ uri: user.imageUrl }}
                    className="home-avatar"
                  />
                ) : (
                  <View className="home-avatar flex items-center justify-center bg-accent">
                    <Text className="font-sans-bold text-lg text-card">
                      {userInitial}
                    </Text>
                  </View>
                )}
                <Text className="home-user-name">{displayName}</Text>
              </View>
              <Image source={icons.add} className="home-add-icon" />
            </View>
            <View className="home-balance-card">
              <Text className="home-balance-label">Balance</Text>
              <View className="home-balance-row">
                <Text className="home-balance-amount">
                  {formatCurrency(HOME_BALANCE.amount)}
                </Text>
                <Text className="home-balance-date">
                  {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD/YYYY")}
                </Text>
              </View>
            </View>
            <View className="mb-5">
              <ListHeading title="Upcoming" />
              <FlatList
                data={UPCOMING_SUBSCRIPTIONS}
                renderItem={({ item }) => (
                  <UpcomingSubscriptionCard {...item} />
                )}
                keyExtractor={(item) => item.id}
                horizontal={true}
                ListEmptyComponent={
                  <Text className="home-empty-state">
                    No upcoming renewals yet
                  </Text>
                }
              />
            </View>
            <ListHeading title="All Subscriptions" />
          </>
        )}
        data={HOME_SUBSCRIPTIONS}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() => handleSubscriptionPress(item.id, item.name)}
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text className="home-empty-state">No subscriptions added yet</Text>
        }
        contentContainerClassName="pb-20"
      />
    </SafeAreaView>
  );
}
