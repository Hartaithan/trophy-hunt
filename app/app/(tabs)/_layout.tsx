import { Tabs } from "expo-router";
import { FC } from "react";
import { House } from "~/icons/house";
import { SquareKanban } from "~/icons/square-kanban";
import { User } from "~/icons/user";
import { TabOptions } from "~/models/tab.model";

const options: TabOptions = {
  headerShown: false,
  tabBarActiveTintColor: "white",
};

const TabLayout: FC = () => {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <House color={color} />,
          ...options,
        }}
      />
      <Tabs.Screen
        name="board"
        options={{
          title: "Board",
          tabBarIcon: ({ color }) => <SquareKanban color={color} />,
          ...options,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User color={color} />,
          ...options,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
