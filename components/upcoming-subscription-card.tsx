import { formatCurrency } from "@/libs/utils";
import { Image, Text, View } from "react-native";

const UpcomingSubscriptionCard = ({
  data: { name, price, daysLeft, icon, currency },
}: any) => {
  return (
    <View className="upcoming-card">
      <View className="upcoming-row">
        <Image className="upcoming-icon" source={icon} />
        <Text className="upcoming-price">
          {formatCurrency(price, currency)}
        </Text>
        <Text className="upcoming-meta" numberOfLines={1}>
          {daysLeft > 1 ? `${daysLeft} days left` : `last day`}
        </Text>
      </View>
      <View></View>
    </View>
  );
};

export default UpcomingSubscriptionCard;
