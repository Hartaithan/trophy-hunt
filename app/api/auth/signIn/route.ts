import { type SignUpBody } from "@/models/AuthModel";
import { createClient } from "@/utils/supabase/server";
import { validatePayload } from "@/utils/payload";
import { cookies } from "next/headers";
import {
  type AuthTokensResponse,
  exchangeCodeForAccessToken,
  exchangeNpssoForCode,
} from "psn-api";

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
  const { email, password, npsso } = body;

  const results = validatePayload(body, ["email", "password", "npsso"]);
  if (results !== null) {
    console.error("invalid payload", results.errors);
    return Response.json(results, { status: 400 });
  }

  let accessCode: string | null = null;
  let authorization: AuthTokensResponse | null = null;

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

  const supabase = createClient(cookies());
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error != null) {
    console.error("sign in with password error", error);
    return Response.json(error, { status: 400 });
  }

  cookies().set("psn-access-token", accessToken, {
    maxAge: expiresIn,
  });
  cookies().set("psn-refresh-token", refreshToken, {
    maxAge: refreshTokenExpiresIn,
  });

  return Response.json({ message: "Successful sign in!" });
};
