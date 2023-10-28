import {
  type NextComponentType,
  type NextPageContext,
  type GetServerSidePropsContext,
  type NextPage,
} from "next";
import { type AppProps as NextAppProps } from "next/app";
import {
  type NullableProfile,
  type NullablePSNProfile,
  type NullableSession,
} from "./AuthModel";
import { type CSSProperties } from "react";

export type ExtendedPageProps = object;

export interface ExtendedInitialProps {
  initialSession: NullableSession;
  initialProfile: NullableProfile;
  initialPSNProfile: NullablePSNProfile;
  isInitialFailed: boolean;
}

export interface AppProps<P = object>
  extends NextAppProps<P>,
    ExtendedInitialProps {
  Component: NextComponentType<
    NextPageContext,
    ExtendedInitialProps,
    ExtendedPageProps
  >;
}

export interface InitialProps {
  ctx: GetServerSidePropsContext;
}

export type Page<P = object, IP = P> = NextPage<P & ExtendedPageProps, IP>;

export interface CustomPosition {
  top?: string | number;
  left?: string | number;
  bottom?: string | number;
  right?: string | number;
  transform: CSSProperties["transform"];
}
