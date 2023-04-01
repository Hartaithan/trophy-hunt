import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, type NextMiddleware } from "next/server";
import {
  getProfileFromUserName,
  type AuthorizationPayload,
  type ProfileFromUserNameResponse,
  exchangeRefreshTokenForAuthTokens,
  type AuthTokensResponse,
} from "psn-api";

type NullableProfileResponse = ProfileFromUserNameResponse | null;
type NullableAuthResponse = AuthTokensResponse | null;

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};

const getProfile = async (token: string): Promise<NullableProfileResponse> => {
  const authorization: AuthorizationPayload = { accessToken: token };
  let response: NullableProfileResponse = null;
  try {
    response = await getProfileFromUserName(authorization, "me");
  } catch (error) {
    console.error("unable to get profile", error);
  }
  return response;
};

const refreshTokens = async (token: string): Promise<NullableAuthResponse> => {
  let authorization: NullableAuthResponse = null;
  try {
    authorization = await exchangeRefreshTokenForAuthTokens(token);
  } catch (error) {
    console.error("unable to refresh tokens", error);
  }
  return authorization;
};

export const middleware: NextMiddleware = async (req) => {
  const res = NextResponse.next();

  let access_token = req.cookies.get("psn-access-token")?.value;
  let refresh_token = req.cookies.get("psn-refresh-token")?.value;

  let response: NullableProfileResponse = null;
  let refreshed_auth: NullableAuthResponse = null;

  const isHome = req.nextUrl.pathname === "/";

  if (isHome) {
    return res;
  }

  if (access_token != null) {
    response = await getProfile(access_token);
  }

  if (access_token == null && refresh_token != null) {
    refreshed_auth = await refreshTokens(refresh_token);
    if (refreshed_auth != null) {
      const { accessToken, refreshToken } = refreshed_auth;
      access_token = accessToken;
      refresh_token = refreshToken;
      response = await getProfile(access_token);
    }
  }

  const supabase = createMiddlewareSupabaseClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAuth = response != null && access_token != null && session != null;
  const isSignIn = req.nextUrl.pathname === "/signIn";

  const redirectUrl = req.nextUrl.clone();

  if (!isAuth && !isSignIn) {
    redirectUrl.pathname = "/signIn";
    const redirectRes = NextResponse.redirect(redirectUrl);
    redirectRes.cookies.delete("supabase-auth-token");
    redirectRes.cookies.delete("psn-access-token");
    redirectRes.cookies.delete("psn-refresh-token");
    return redirectRes;
  }

  if (isAuth && isSignIn) {
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  if (refreshed_auth != null) {
    const { accessToken, expiresIn, refreshToken, refreshTokenExpiresIn } =
      refreshed_auth;
    res.cookies.set("psn-access-token", accessToken, { maxAge: expiresIn });
    res.cookies.set("psn-refresh-token", refreshToken, {
      maxAge: refreshTokenExpiresIn,
    });
  }

  return res;
};
