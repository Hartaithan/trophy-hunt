import { type Session, type User } from "@supabase/supabase-js";
import {
  type AuthTokensResponse,
  type ProfileFromUserNameResponse,
} from "psn-api";

export type NullableSession = Session | null;
export type NullableUser = User | null;
export type NullableProfile = IProfile | null;
export type NullablePSNProfile = ProfileFromUserNameResponse["profile"] | null;
export type NullableAuthResponse = AuthTokensResponse | null;

export interface ISignUpBody extends Record<string, string> {
  email: string;
  password: string;
  npsso: string;
  language: string;
  username: string;
}

interface IUserData {
  language: string;
  username: string;
  onlineId: string;
}

export interface IUser extends User {
  user_metadata: User["user_metadata"] & IUserData;
}

export interface IProfile {
  id: string;
  created_at: string;
  language: string;
  username: string;
  online_id: string;
}

export interface ISessionResponse {
  session: NullableSession;
  profile: NullableProfile;
}

export type PSNProfile = ProfileFromUserNameResponse["profile"];
