import { Image, View } from "react-native";

const UpcomingSubscriptionCard = ({
  data: { name, price, daysLeft, icon },
}: any) => {
  return (
    <View className="upcoming-card">
      <View className="upcoming-row">
        <Image className="upcoming-icon" source={icon} />
      </View>
      <View></View>
    </View>
  );
};

export default UpcomingSubscriptionCard;
