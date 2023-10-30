import "../globals.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";
import type { Metadata } from "next";
import { type FC, type PropsWithChildren } from "react";
import { ColorSchemeScript, Container } from "@mantine/core";
import Header from "@/components/Header/Header";
import AppProviders from "@/providers/AppProviders";
import AuthProviders from "@/providers/AuthProviders";

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
        <AppProviders>
          <AuthProviders>
            <Header />
            <Container h="100%" w="100%">
              {children}
            </Container>
          </AuthProviders>
        </AppProviders>
      </body>
    </html>
  );
};

export default RootLayout;
