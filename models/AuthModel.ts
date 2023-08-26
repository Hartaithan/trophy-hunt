import { type Session, type User } from "@supabase/supabase-js";
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
export type NullableUser = User | null;
export type NullableProfile = IProfile | null;
export type NullablePSNProfile = PSNProfile | null;
export type NullableAuthResponse = AuthTokensResponse | null;

export type ProfileType = "public" | "private";
export type Presence = PSNProfile["presences"][0];

export interface ISignUpBody extends Record<string, string> {
  email: string;
  password: string;
  npsso: string;
  language: string;
  username: string;
  type: ProfileType;
}

interface IUserData {
  language: string;
  username: string;
  onlineId: string;
  type: ProfileType;
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
  type: ProfileType;
}

export type ProfileEditBody = Pick<IProfile, "language" | "type">;

export interface ISessionResponse {
  session: NullableSession;
  profile: NullableProfile;
}
