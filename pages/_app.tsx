import "@/styles/globals.css";
import { useState } from "react";
import { Inter } from "next/font/google";
import { MantineProvider } from "@mantine/core";
import {
  type IExtendedInitialProps,
  type IAppProps,
  type IInitialProps,
  type NullableSession,
} from "@/models/AppModel";
import MainLayout from "@/layouts/MainLayout";
import theme from "@/styles/theme";
import {
  createBrowserSupabaseClient,
  createServerSupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

const inter = Inter({ subsets: ["latin", "cyrillic"] });
const isServerSide = typeof window === "undefined";

const App = (props: IAppProps): JSX.Element => {
  const { Component, pageProps, initialSession } = props;

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
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </MantineProvider>
    </SessionContextProvider>
  );
};

const getInitialProps = async ({
  ctx,
}: IInitialProps): Promise<IExtendedInitialProps> => {
  let initialSession: NullableSession = null;

  if (isServerSide) {
    const supabase = createServerSupabaseClient(ctx);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    initialSession = session;
  }

  return { initialSession };
};

App.getInitialProps = getInitialProps;

export default App;
