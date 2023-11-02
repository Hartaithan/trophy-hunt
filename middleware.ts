import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, type NextMiddleware } from "next/server";
import { type NullableAuthResponse } from "./models/AuthModel";
import { exchangeRefreshTokenForAuthTokens } from "psn-api";
import { cookies } from "next/headers";

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
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let refreshed_auth: NullableAuthResponse = null;
  let access_token = req.cookies.get("psn-access-token")?.value;
  let refresh_token = req.cookies.get("psn-refresh-token")?.value;

  const redirectUrl = req.nextUrl.clone();
  const pathname = req.nextUrl.pathname;

  const isAuthPage = ["/signIn", "/signUp"].includes(pathname);

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
    session != null;

  if (pathname === "/") return res;

  if (!isAuth && !isAuthPage) {
    const allCookies = cookies().getAll();
    redirectUrl.pathname = "/signIn";
    const redirectRes = NextResponse.redirect(redirectUrl);
    for (let i = 0; i < allCookies.length; i++) {
      const cookie = allCookies[i];
      redirectRes.cookies.delete(cookie.name);
    }
    return redirectRes;
  }

  if (isAuth && isAuthPage) {
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  if (refreshed_auth != null) {
    const { accessToken, expiresIn } = refreshed_auth;
    res.cookies.set("psn-access-token", accessToken, { maxAge: expiresIn });
  }

  return res;
};
