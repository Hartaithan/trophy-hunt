import "../globals.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";
import type { Metadata } from "next";
import { type FC, type PropsWithChildren } from "react";
import { Inter } from "next/font/google";
import { MantineProvider, ColorSchemeScript, Container } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { theme } from "@/styles/theme";
import Header from "@/components/Header/Header";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Trophy Hunt",
  description: "Trophy Hunt App",
};

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <MantineProvider
          theme={{ ...theme, fontFamily: inter.style.fontFamily }}
          defaultColorScheme="dark">
          <Notifications />
          <ModalsProvider>
            <Providers>
              <Header />
              <Container h="100%" w="100%">
                {children}
              </Container>
            </Providers>
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
};

export default RootLayout;
