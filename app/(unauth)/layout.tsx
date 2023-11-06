import "../globals.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";
import type { Metadata } from "next";
import { type FC, type PropsWithChildren } from "react";
import { ColorSchemeScript, Container } from "@mantine/core";
import AppProviders from "@/providers/AppProviders";

export const metadata: Metadata = {
  title: "Welcome to Trophy Hunt",
  description: "Trophy Hunt App",
};

const UnAuthLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <AppProviders>
          <Container id="main">{children}</Container>
        </AppProviders>
      </body>
    </html>
  );
};

export default UnAuthLayout;
