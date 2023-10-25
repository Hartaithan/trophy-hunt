import "./globals.css";
import "@mantine/core/styles.css";
import type { Metadata } from "next";
import { type FC, type PropsWithChildren } from "react";
import { Inter } from "next/font/google";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { theme } from "@/styles/theme";

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
          {children}
        </MantineProvider>
      </body>
    </html>
  );
};

export default RootLayout;
