import "../globals.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";
import type { Metadata } from "next";
import { type FC, type PropsWithChildren } from "react";
import { ColorSchemeScript, Container } from "@mantine/core";
import Header from "@/components/Header/Header";
import AppProviders from "@/providers/AppProviders";
import { type NullablePSNProfile } from "@/models/AuthModel";
import { API_URL } from "@/utils/api";
import { cookies, headers } from "next/headers";

export const metadata: Metadata = {
  title: "Trophy Hunt",
  description: "Trophy Hunt App",
};

const getRefreshedCookies = (): string => {
  let refreshed: string = cookies().toString() ?? "";
  if (refreshed.includes("psn-access-token")) {
    return refreshed;
  }
  const responseCookies = headers().get("set-cookie");
  if (responseCookies !== undefined) {
    refreshed = `${refreshed}; ${responseCookies}`;
  }
  return refreshed;
};

const getProfile = async (): Promise<NullablePSNProfile> => {
  try {
    const cookies = getRefreshedCookies();
    const response = await fetch(API_URL + "/profile/psn", {
      cache: "force-cache",
      headers: {
        Cookie: cookies,
      },
    });
    const data = await response.json();
    if (!response.ok) throw Error();
    const profile: NullablePSNProfile = data != null ? data.profile : null;
    return profile;
  } catch (error) {
    console.error("unable to fetch profile", error);
    return null;
  }
};

const AuthLayout: FC<PropsWithChildren> = async ({ children }) => {
  const profile = await getProfile();
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <AppProviders>
          <Header profile={profile} />
          <Container h="100%" w="100%">
            {children}
          </Container>
        </AppProviders>
      </body>
    </html>
  );
};

export default AuthLayout;
