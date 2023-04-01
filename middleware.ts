import { NextResponse, type NextMiddleware } from "next/server";
import {
  exchangeRefreshTokenForAuthTokens,
  type AuthTokensResponse,
} from "psn-api";

type NullableAuthResponse = AuthTokensResponse | null;

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
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
  const isSignIn = req.nextUrl.pathname === "/signIn";

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
    (access_token === undefined && refresh_token === undefined) ||
    supabase_token === undefined;

  if (isAuth && !isSignIn) {
    redirectUrl.pathname = "/signIn";
    const redirectRes = NextResponse.redirect(redirectUrl);
    redirectRes.cookies.delete("supabase-auth-token");
    redirectRes.cookies.delete("psn-access-token");
    redirectRes.cookies.delete("psn-refresh-token");
    return redirectRes;
  }

  if (!isAuth && isSignIn) {
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
