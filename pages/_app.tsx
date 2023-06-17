import "@/styles/globals.css";
import { useCallback, useEffect, useState } from "react";
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
import {
  type NullableUser,
  type NullablePSNProfile,
  type NullableSession,
  type ISessionResponse,
  type NullableProfile,
} from "@/models/AuthModel";
import ProfileProvider from "@/providers/ProfileProvider";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { useRouter } from "next/router";
import { deleteCookie, getCookie } from "cookies-next";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const inter = Inter({ subsets: ["latin", "cyrillic"], display: "swap" });
const isServerSide = typeof window === "undefined";

const getSession = async (
  ctx: IInitialProps["ctx"]
): Promise<ISessionResponse> => {
  const supabase = createServerSupabaseClient(ctx);
  const { data } = await supabase.auth.getSession();
  const user: NullableUser = data.session?.user ?? null;
  if (user === null || data === null) {
    console.error("unable to get initial user");
    return { session: data.session, profile: null };
  }
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (profileError !== null || profile === null) {
    console.error("unable to get initial profile", profileError);
    return { session: data.session, profile: null };
  }
  return { session: data.session, profile: profile as NullableProfile };
};

const getRefreshedCookies = (ctx: IInitialProps["ctx"]): string => {
  let cookies: string = ctx.req.headers.cookie?.toString() ?? "";

  if (cookies.includes("psn-access-token")) {
    return cookies;
  }

  const responseCookies = ctx.req.headers["set-cookie"];
  if (responseCookies !== undefined) {
    cookies = `${cookies}; ${responseCookies.join("; ")}`;
  }

  return cookies;
};

const getPSNProfile = async (
  ctx: IInitialProps["ctx"]
): Promise<NullablePSNProfile> => {
  let profile: NullablePSNProfile = null;
  const cookies = getRefreshedCookies(ctx);

  if (API_URL === undefined) {
    console.error("API_URL not found");
    return null;
  }

  try {
    const url = `${API_URL}/profile/psn`;
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: cookies,
      },
    }).then(async (res) => await res.json());
    profile = response.profile ?? null;
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
  let initialPSNProfile: NullablePSNProfile = null;

  if (isServerSide) {
    const [session, profile] = await Promise.allSettled([
      getSession(ctx),
      getPSNProfile(ctx),
    ]);
    if (session.status === "fulfilled") {
      initialSession = session.value.session;
      initialProfile = session.value.profile;
    }
    if (profile.status === "fulfilled") {
      initialPSNProfile = profile.value;
    }
  }

  return { initialSession, initialProfile, initialPSNProfile };
};

const App = (props: IAppProps): JSX.Element => {
  const {
    Component,
    pageProps,
    initialSession,
    initialProfile,
    initialPSNProfile,
  } = props;

  const supabaseClient = createBrowserSupabaseClient();
  const [supabase] = useState(supabaseClient);
  const router = useRouter();

  const invalidSessionHandler = useCallback(() => {
    const auth = getCookie("supabase-auth-token");
    if (auth != null && initialSession === null) {
      deleteCookie("psn-access-token");
      deleteCookie("psn-refresh-token");
      deleteCookie("supabase-auth-token");
      router.reload();
    }
  }, [initialSession, router]);

  useEffect(() => {
    invalidSessionHandler();
  }, [invalidSessionHandler]);

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
        <ProfileProvider
          initialProfile={initialProfile}
          initialPSNProfile={initialPSNProfile}
        >
          <ModalsProvider>
            <MainLayout>
              <Notifications />
              <Component {...pageProps} />
            </MainLayout>
          </ModalsProvider>
        </ProfileProvider>
      </MantineProvider>
    </SessionContextProvider>
  );
};

App.getInitialProps = getInitialProps;

export default App;
