import "@/styles/globals.css";
import { useState } from "react";
import { Inter } from "next/font/google";
import { MantineProvider } from "@mantine/core";
import {
  type IExtendedInitialProps,
  type IAppProps,
  type IInitialProps,
} from "@/models/AppModel";
import MainLayout from "@/layouts/MainLayout";
import theme from "@/styles/theme";
import {
  createBrowserSupabaseClient,
  createServerSupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { type NullableProfile, type NullableSession } from "@/models/AuthModel";
import PSNProvider from "@/providers/PSNProvider";
import API from "@/api/API";

const inter = Inter({ subsets: ["latin", "cyrillic"] });
const isServerSide = typeof window === "undefined";

const getSession = async (
  ctx: IInitialProps["ctx"]
): Promise<NullableSession> => {
  const supabase = createServerSupabaseClient(ctx);
  const { data } = await supabase.auth.getSession();
  return data.session;
};

const getRefreshedCookies = (ctx: IInitialProps["ctx"]): string => {
  let cookies: string = ctx.req.headers.cookie?.toString() ?? "";

  if (!cookies.includes("psn-access-token")) {
    const responseCookies = ctx.res.getHeader("set-cookie");
    if (responseCookies instanceof Array) {
      cookies = `${cookies}; ${responseCookies.join("; ")}`;
    } else if (responseCookies !== undefined) {
      cookies = `${cookies} ${responseCookies.toString()}`;
    }
  }

  return cookies;
};

const getProfile = async (
  ctx: IInitialProps["ctx"]
): Promise<NullableProfile> => {
  let profile: NullableProfile = null;
  const cookies = getRefreshedCookies(ctx);

  try {
    const { data } = await API.get("/profile", {
      headers: { Cookie: cookies },
    });
    profile = data.profile ?? null;
  } catch (error) {
    console.error("unable to fetch profile", error);
  }
  return profile;
};

const getInitialProps = async ({
  ctx,
}: IInitialProps): Promise<IExtendedInitialProps> => {
  let initialSession: NullableSession = null;
  let initialProfile: NullableProfile = null;

  if (isServerSide) {
    const [session, profile] = await Promise.allSettled([
      getSession(ctx),
      getProfile(ctx),
    ]);
    if (session.status === "fulfilled") {
      initialSession = session.value;
    }
    if (profile.status === "fulfilled") {
      initialProfile = profile.value;
    }
  }

  return { initialSession, initialProfile };
};

const App = (props: IAppProps): JSX.Element => {
  const { Component, pageProps, initialSession, initialProfile } = props;

  const supabaseClient = createBrowserSupabaseClient();
  const [supabase] = useState(supabaseClient);

  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={initialSession}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          ...theme,
          fontFamily: inter.style.fontFamily,
        }}
      >
        <PSNProvider initialProfile={initialProfile}>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </PSNProvider>
      </MantineProvider>
    </SessionContextProvider>
  );
};

App.getInitialProps = getInitialProps;

export default App;
