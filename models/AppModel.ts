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

export type IExtendedPageProps = object;

export interface IExtendedInitialProps {
  initialSession: NullableSession;
  initialProfile: NullableProfile;
  initialPSNProfile: NullablePSNProfile;
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
