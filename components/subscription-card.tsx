import { formatCurrency, formatSubscriptionDateTime } from "@/libs/utils";
import { clsx } from "clsx";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

const SubscriptionCard = ({
  name,
  category,
  onPress,
  expanded,
  price,
  color,
  currency,
  icon,
  billing,
  renewalDate,
  plan,
}: SubscriptionCardProps) => {
  return (
    <Pressable
      onPress={onPress}
      className={clsx("sub-card", expanded ? "sub-card-expanded" : "by-card")}
      style={!expanded && color ? { backgroundColor: color } : undefined}
    >
      <View className="sub-head">
        <View className="sub-main">
          <Image source={icon} className="sub-icon" />
          <View className="sub-copy">
            <Text>{name}</Text>
            <Text>
              {category?.trim() ||
                plan?.trim() ||
                (renewalDate ? formatSubscriptionDateTime(renewalDate) : "")}
            </Text>
          </View>
        </View>
        <View className="sub-price-box">
          <Text className="sub-price">{formatCurrency(price, currency)}</Text>
          <Text className="sub-billing">{billing}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default SubscriptionCard;
