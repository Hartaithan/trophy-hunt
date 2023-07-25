import {
  type NextComponentType,
  type NextPageContext,
  type GetServerSidePropsContext,
  type NextPage,
} from "next";
import { type AppProps } from "next/app";
import {
  type NullableProfile,
  type NullablePSNProfile,
  type NullableSession,
} from "./AuthModel";
import { type CSSProperties } from "react";

export type IExtendedPageProps = object;

export interface IExtendedInitialProps {
  initialSession: NullableSession;
  initialProfile: NullableProfile;
  initialPSNProfile: NullablePSNProfile;
  isInitialFailed: boolean;
}

export interface IAppProps<P = object>
  extends AppProps<P>,
    IExtendedInitialProps {
  Component: NextComponentType<
    NextPageContext,
    IExtendedInitialProps,
    IExtendedPageProps
  >;
}

export interface IInitialProps {
  ctx: GetServerSidePropsContext;
}

export type IPage<P = object, IP = P> = NextPage<P & IExtendedPageProps, IP>;

export interface ICustomPosition {
  top?: string | number;
  left?: string | number;
  bottom?: string | number;
  right?: string | number;
  transform: CSSProperties["transform"];
}
