import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";
import type { Metadata, Viewport } from "next";
import { type FC, type PropsWithChildren } from "react";
import { ColorSchemeScript } from "@mantine/core";
import AppProviders from "@/providers/AppProviders";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Welcome to Trophy Hunt",
  description: "Trophy Hunt App",
  applicationName: "Trophy Hunt",
};

export const viewport: Viewport = {
  themeColor: "#121212",
  colorScheme: "dark",
};

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <AppProviders fontFamily={inter.style.fontFamily}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
};

export default MainLayout;
