import { Tabs } from "expo-router";
import { FC } from "react";

const TabLayout: FC = () => {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="board" options={{ title: "Board" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
};

export default TabLayout;
