import { extendedColors } from "@/styles/colors";
import { theme } from "@/styles/theme";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { Inter } from "next/font/google";
import { type FC, type PropsWithChildren } from "react";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

const AppProviders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <MantineProvider
      theme={{
        ...theme,
        fontFamily: inter.style.fontFamily,
        colors: extendedColors,
      }}
      defaultColorScheme="dark">
      <Notifications />
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProvider>
  );
};

export default AppProviders;
