import { type Session, type User } from "@supabase/supabase-js";
import { type AuthTokensResponse, type ProfileFromUserNameResponse } from "psn-api";

export type NullableSession = Session | null;
export type NullableUser = User | null;

export interface ISignUpBody extends Record<string, string> {
  email: string;
  password: string;
  npsso: string;
  lang: string;
}

interface IUserData {
  onlineId: string;
}

export interface IUser extends User {
  user_metadata: User["user_metadata"] & IUserData;
}

export type Profile = ProfileFromUserNameResponse["profile"];

export type NullableProfile = ProfileFromUserNameResponse["profile"] | null;

export type NullableAuthResponse = AuthTokensResponse | null;
