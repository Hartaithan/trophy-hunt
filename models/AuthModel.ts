import { type Session, type User as SupabaseUser } from "@supabase/supabase-js";
import {
  type AuthTokensResponse,
  type ProfileFromUserNameResponse,
} from "psn-api";

type PSNProfileResponse = ProfileFromUserNameResponse["profile"];
type PersonalDetail = PSNProfileResponse["personalDetail"];

export interface PSNProfile extends Omit<PSNProfileResponse, "personalDetail"> {
  personalDetail: PersonalDetail & { middleName: string | undefined };
}

export type NullableSession = Session | null;
export type NullableUser = SupabaseUser | null;
export type NullableProfile = Profile | null;
export type NullablePSNProfile = PSNProfile | null;
export type NullableAuthResponse = AuthTokensResponse | null;

export type ProfileType = "public" | "private";
export type Presence = PSNProfile["presences"][0];

export interface SignUpBody extends Record<string, string> {
  email: string;
  password: string;
  npsso: string;
  language: string;
  username: string;
  type: ProfileType;
}

export interface ForgotBody extends Record<string, string> {
  email: string;
}

interface UserData {
  language: string;
  username: string;
  onlineId: string;
  type: ProfileType;
}

export interface User extends SupabaseUser {
  user_metadata: SupabaseUser["user_metadata"] & UserData;
}

export interface Profile {
  id: string;
  created_at: string;
  language: string;
  username: string;
  online_id: string;
  type: ProfileType;
}

export type ProfileEditBody = Pick<Profile, "language" | "type">;

export interface SessionResponse {
  session: NullableSession;
  profile: NullableProfile;
}

export interface UpdatePasswordBody {
  current_password: string;
  new_password: string;
}

export interface SetPasswordBody {
  password: string;
}
