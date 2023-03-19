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

type NullableScheme = ColorScheme | null;

interface IInitialProps {
  ctx: GetServerSidePropsContext;
}

const inter = Inter({ subsets: ["latin", "cyrillic"] });

const App = (props: IAppProps): JSX.Element => {
  const { Component, pageProps } = props;

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
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme,
          fontFamily: inter.style.fontFamily,
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

App.getInitialProps = ({ ctx }: IInitialProps): IExtendedInitialProps => {
  const schemeFromCookie = getCookie("mantine-color-scheme", ctx);
  const colorScheme = (schemeFromCookie ?? null) as NullableScheme;
  return { colorScheme };
};

export default App;
