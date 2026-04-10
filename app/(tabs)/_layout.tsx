import { tabs } from "@/constants/data";
import clsx from "clsx";
import { Image } from "expo-image";
import { Tabs } from "expo-router";
import { View } from "react-native";

const TabLayout = () => {
  const TabBarIcon = ({ focused, icon }: TabIconProps) => {
    return (
      <View className="tabs-icon">
        <View className={clsx("tabs-pill", focused && "tabs-active")}>
          <Image source={icon} className="tabs-glygh" />
        </View>
      </View>
    );
  };

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} icon={tab.icons} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
};

export default TabLayout;
