import { type ColorScheme } from "@mantine/core";
import { type Session, type User } from "@supabase/supabase-js";
import { type NextPage } from "next";
import { type AppProps } from "next/app";

export type NullableSession = Session | null;
export type NullableUser = User | null;

export interface SessionResponse {
  initialSession: NullableSession;
  user: NullableUser;
}

export interface IExtendedInitialProps {
  colorScheme: ColorScheme | null;
}

export interface IAppProps<P = object>
  extends AppProps<P & SessionResponse>,
    IExtendedInitialProps {
  Component: AppProps["Component"];
}

export type IPage<P = object & SessionResponse, IP = P> = NextPage<P, IP>;
