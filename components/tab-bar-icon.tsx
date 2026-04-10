import clsx from "clsx";
import { Image, View } from "react-native";

const TabBarIcon = ({ focused, icon }: TabIconProps) => {
  return (
    <View className="tabs-icon">
      <View className={clsx("tabs-pill", focused && "tabs-active")}>
        <Image source={icon} className="tabs-glyph" resizeMode="contain" />
      </View>
    </View>
  );
};

export default TabBarIcon;
