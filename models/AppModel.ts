import { type ColorScheme } from "@mantine/core";
import { type NextPage } from "next";
import { type AppProps } from "next/app";

export interface IExtendedInitialProps {
  colorScheme: ColorScheme | null;
}

export interface IAppProps<P = object>
  extends AppProps<P>,
    IExtendedInitialProps {
  Component: AppProps["Component"];
}

export type IPage<P = object, IP = P> = NextPage<P, IP>;
