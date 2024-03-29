import type { Metadata, Viewport } from "next";
import { Fragment, type FC, type PropsWithChildren } from "react";
import Header from "@/components/Header/Header";
import { type NullablePSNProfile } from "@/models/AuthModel";
import { API_URL } from "@/constants/api";
import { getRefreshedCookies } from "@/utils/cookies";
import { Container } from "@mantine/core";

export const metadata: Metadata = {
  title: "Trophy Hunt",
  description: "Trophy Hunt App",
  applicationName: "Trophy Hunt",
};

export const viewport: Viewport = {
  themeColor: "#121212",
  colorScheme: "dark",
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
    <Fragment>
      <Header profile={profile} />
      <Container id="main">{children}</Container>
      <div id="reward" />
    </Fragment>
  );
};

export default AuthLayout;
