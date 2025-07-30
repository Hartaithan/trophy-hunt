import { Tabs } from "expo-router";
import { FC } from "react";
import { TabOptions } from "~/models/tab.model";

const options: TabOptions = {
  headerShown: false,
  tabBarActiveTintColor: "white",
};

const TabLayout: FC = () => {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen name="index" options={{ title: "Home", ...options }} />
      <Tabs.Screen name="board" options={{ title: "Board", ...options }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", ...options }} />
    </Tabs>
  );
};

export default TabLayout;
