import { NextResponse, type NextMiddleware } from "next/server";
import { exchangeRefreshTokenForAuthTokens } from "psn-api";
import { type NullableAuthResponse } from "./models/AuthModel";

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next|favicon.ico).*)",
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
  const supabase_token = req.cookies.get("supabase-auth-token")?.value;
  const isSignIn = ["/signIn", "/signUp"].includes(req.nextUrl.pathname);

  let refreshed_auth: NullableAuthResponse = null;
  const redirectUrl = req.nextUrl.clone();

  if (access_token === undefined && refresh_token !== undefined) {
    refreshed_auth = await refreshTokens(refresh_token);
    if (refreshed_auth != null) {
      const { accessToken, refreshToken } = refreshed_auth;
      access_token = accessToken;
      refresh_token = refreshToken;
    }
  }

  const isAuth =
    access_token !== undefined &&
    refresh_token !== undefined &&
    supabase_token !== undefined;

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
    const { accessToken, expiresIn } = refreshed_auth;
    res.cookies.set("psn-access-token", accessToken, { maxAge: expiresIn });
  }

  return res;
};
