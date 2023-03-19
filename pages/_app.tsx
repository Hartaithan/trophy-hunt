import "@/styles/globals.css";
import { useState } from "react";
import { Inter } from "next/font/google";
import { useColorScheme, useHotkeys } from "@mantine/hooks";
import {
  type ColorScheme,
  MantineProvider,
  ColorSchemeProvider,
} from "@mantine/core";
import { getCookie, setCookie } from "cookies-next";
import { type IExtendedInitialProps, type IAppProps } from "@/models/AppModel";
import { type GetServerSidePropsContext } from "next";
import MainLayout from "@/layouts/MainLayout";
import theme from "@/styles/theme";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

type NullableScheme = ColorScheme | null;

interface IInitialProps {
  ctx: GetServerSidePropsContext;
}

const inter = Inter({ subsets: ["latin", "cyrillic"] });

const App = (props: IAppProps): JSX.Element => {
  const { Component, pageProps } = props;

  const supabaseClient = createBrowserSupabaseClient();
  const [supabase] = useState(supabaseClient);

  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme ?? preferredColorScheme
  );

  const toggleColorScheme = (value?: ColorScheme): void => {
    const defaultColorScheme = colorScheme === "dark" ? "light" : "dark";
    const nextColorScheme = value ?? defaultColorScheme;
    setColorScheme(nextColorScheme);
    setCookie("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  useHotkeys([
    ["mod+J", () => toggleColorScheme()],
    ["ctrl+J", () => toggleColorScheme()],
  ]);

  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps?.initialSession}
    >
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            ...theme,
            colorScheme,
            fontFamily: inter.style.fontFamily,
          }}
        >
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </MantineProvider>
      </ColorSchemeProvider>
    </SessionContextProvider>
  );
};

App.getInitialProps = ({ ctx }: IInitialProps): IExtendedInitialProps => {
  const schemeFromCookie = getCookie("mantine-color-scheme", ctx);
  const colorScheme = (schemeFromCookie ?? null) as NullableScheme;
  return { colorScheme };
};

export default App;
