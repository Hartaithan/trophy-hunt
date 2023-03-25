import "@/styles/globals.css";
import { useState } from "react";
import { Inter } from "next/font/google";
import { MantineProvider } from "@mantine/core";
import { type IAppProps } from "@/models/AppModel";
import MainLayout from "@/layouts/MainLayout";
import theme from "@/styles/theme";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

const App = (props: IAppProps): JSX.Element => {
  const { Component, pageProps } = props;

  const supabaseClient = createBrowserSupabaseClient();
  const [supabase] = useState(supabaseClient);

  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps?.initialSession}
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

export default App;
