import { Text, View } from "react-native";

const UpcomingSubscriptionCard = ({
  data: { name, price, daysLeft, icon },
}: any) => {
  return (
    <View>
      <Text>{name}</Text>
    </View>
  );
};

export default UpcomingSubscriptionCard;
