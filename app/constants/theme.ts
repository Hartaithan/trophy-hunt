import { DarkTheme, Theme } from "@react-navigation/native";

export const NAV_THEME = {
  background: "hsl(240 10% 3.9%)",
  border: "hsl(240 3.7% 15.9%)",
  card: "hsl(240 10% 3.9%)",
  notification: "hsl(0 72% 51%)",
  primary: "hsl(0 0% 98%)",
  text: "hsl(0 0% 98%)",
};

export const THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME,
};
