import { type Session, type User } from "@supabase/supabase-js";
import {
  type NextComponentType,
  type NextPageContext,
  type GetServerSidePropsContext,
  type NextPage,
} from "next";
import { type AppProps } from "next/app";

export type NullableSession = Session | null;
export type NullableUser = User | null;

export type IExtendedPageProps = object;

export interface IExtendedInitialProps {
  initialSession: NullableSession;
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
