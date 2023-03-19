import "@/styles/globals.css";
import { MantineProvider } from "@mantine/core";
import { type AppProps } from "next/app";
import { type FC } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

const App: FC<AppProps> = (props) => {
  const { Component, pageProps } = props;

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "dark",
        fontFamily: inter.style.fontFamily,
      }}
    >
      <Component {...pageProps} />
    </MantineProvider>
  );
};

export default App;
