import { type PSNProfileResponse, type SignUpBody } from "@/models/AuthModel";
import { createClient } from "@/utils/supabase/server";
import { validatePayload } from "@/utils/payload";
import { cookies } from "next/headers";
import {
  type AuthTokensResponse,
  exchangeNpssoForCode,
  exchangeCodeForAccessToken,
  getProfileFromUserName,
} from "psn-api";
import { REDIRECT_URL } from "@/constants/api";

export const POST = async (req: Request): Promise<Response> => {
  let body: SignUpBody | null = null;
  try {
    const request: SignUpBody = await req.json();
    body = request;
  } catch (error) {
    console.error("request body not found", error);
    return Response.json(
      { message: "Request body not found" },
      { status: 400 },
    );
  }
  const { email, password, npsso, language, username, type } = body;

  const results = validatePayload(body, [
    "email",
    "password",
    "npsso",
    "language",
    "username",
    "type",
  ]);
  if (results !== null) {
    console.error("invalid payload", results.errors);
    return Response.json(results, { status: 400 });
  }

  let accessCode: string | null = null;
  let authorization: AuthTokensResponse | null = null;
  let profile: PSNProfileResponse | null = null;

  try {
    accessCode = await exchangeNpssoForCode(npsso);
  } catch (error) {
    console.error("exchange access code error", error);
    return Response.json(
      { message: "Unable to get PSN access code" },
      { status: 400 },
    );
  }

  try {
    authorization = await exchangeCodeForAccessToken(accessCode);
  } catch (error) {
    console.error("exchange access token error", error);
    return Response.json(
      { message: "Unable to get PSN access token" },
      { status: 400 },
    );
  }

  const { accessToken, expiresIn, refreshToken, refreshTokenExpiresIn } =
    authorization;
  cookies().set("psn-access-token", accessToken, {
    maxAge: expiresIn,
  });
  cookies().set("psn-refresh-token", refreshToken, {
    maxAge: refreshTokenExpiresIn,
  });

  try {
    const profileRes = await getProfileFromUserName(authorization, "me");
    profile = profileRes.profile;
  } catch (error) {
    console.error("get profile error", error);
    return Response.json({ message: "Unable to get profile" }, { status: 400 });
  }

  const supabase = createClient(cookies());
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, language, onlineId: profile.onlineId, type },
      emailRedirectTo: REDIRECT_URL,
    },
  });
  if (error != null) {
    cookies().delete("psn-access-token");
    cookies().delete("psn-refresh-token");
    console.error("unable to sign up", error);
    return Response.json({ message: "Unable to sign up" }, { status: 400 });
  }
  if (data?.user?.identities?.length === 0) {
    return Response.json({ message: "Email already in use" }, { status: 400 });
  }
  return Response.json(
    { message: "User successfully created!", user: data.user },
    { status: 201 },
  );
};
