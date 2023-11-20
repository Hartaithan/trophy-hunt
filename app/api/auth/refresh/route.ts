import { type NullableAuthResponse } from "@/models/AuthModel";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { exchangeRefreshTokenForAuthTokens } from "psn-api";

export const GET = async (): Promise<Response> => {
  const access_token = cookies().get("psn-access-token")?.value;
  const refresh_token = cookies().get("psn-refresh-token")?.value;

  if (access_token !== undefined) {
    console.error("user already has psn-access-token", access_token);
    return Response.json(
      { message: "You already have an access token" },
      { status: 400 },
    );
  }

  if (typeof refresh_token !== "string") {
    console.error("psn-refresh-token not found", refresh_token);
    return Response.json(
      { message: "Unable to get refresh token" },
      { status: 400 },
    );
  }

  const supabase = createClient(cookies());
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError !== null || user === null) {
    console.error("unable to get user", userError);
    return Response.json({ message: "Unable to get user" }, { status: 400 });
  }

  let authorization: NullableAuthResponse = null;
  try {
    authorization = await exchangeRefreshTokenForAuthTokens(refresh_token);
  } catch (error) {
    console.error("unable to refresh tokens", error);
  }

  if (authorization == null) {
    return Response.json(
      { message: "Unable to refresh tokens" },
      { status: 400 },
    );
  }

  const { accessToken, expiresIn } = authorization;
  cookies().set("psn-access-token", accessToken, {
    maxAge: expiresIn,
  });

  return Response.json({ message: "Tokens successfully refreshed!" });
};
