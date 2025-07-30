import { Tabs } from "expo-router";

export type TabProps = Parameters<typeof Tabs.Screen>[0];
export type TabOptions = TabProps["options"];
