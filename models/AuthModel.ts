import { type User } from "@supabase/supabase-js";

export interface ISignUpBody {
  email: string;
  password: string;
  npsso: string;
}

interface IUserData {
  onlineId: string;
}

export interface IUser extends User {
  user_metadata: User["user_metadata"] & IUserData;
}
