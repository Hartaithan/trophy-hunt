import "@/styles/globals.css";
import { type AppProps } from "next/app";
import { type FC } from "react";

const App: FC<AppProps> = (props) => {
  const { Component, pageProps } = props;
  return <Component {...pageProps} />;
};

export default App;
