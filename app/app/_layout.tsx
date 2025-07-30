import "~/global.css";

import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FC, useRef, useState } from "react";
import { Platform } from "react-native";
import { DARK_THEME, LIGHT_THEME } from "~/constants/theme";
import { useColorScheme } from "~/hooks/use-color-scheme";
import { useIsomorphicLayoutEffect } from "~/hooks/use-isomorphic-layout-effect";
export { ErrorBoundary } from "expo-router";

const RootLayout: FC = () => {
  const hasMounted = useRef(false);
  const { isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) return;
    if (Platform.OS === "web") {
      document.documentElement.classList.add("bg-background");
    }
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  if (!isColorSchemeLoaded) return null;

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
};

export default RootLayout;
