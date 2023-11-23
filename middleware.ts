import { NextResponse, type NextMiddleware } from "next/server";
import { type NullableAuthResponse } from "./models/AuthModel";
import { exchangeRefreshTokenForAuthTokens } from "psn-api";
import { cookies } from "next/headers";
import { createClient } from "./utils/supabase/middleware";

const authRoutes = ["/signIn", "/signUp", "/setPassword", "/forgot"];

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

const resetCookies = (res: NextResponse): NextResponse => {
  const allCookies = cookies().getAll();
  for (let i = 0; i < allCookies.length; i++) {
    const cookie = allCookies[i];
    res.cookies.delete(cookie.name);
  }
  return res;
};

export const middleware: NextMiddleware = async (req) => {
  const { supabase, res } = createClient(req);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let refreshed_auth: NullableAuthResponse = null;
  let access_token = req.cookies.get("psn-access-token")?.value;
  let refresh_token = req.cookies.get("psn-refresh-token")?.value;

  const redirectUrl = req.nextUrl.clone();
  const pathname = req.nextUrl.pathname;

  const isAuthPage = authRoutes.includes(pathname);
  const isHomePage = pathname === "/";

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

  if (!isAuth && isHomePage) {
    return resetCookies(res);
  }

  if (!isAuth && !isAuthPage) {
    redirectUrl.pathname = "/signIn";
    const redirectRes = NextResponse.redirect(redirectUrl);
    return resetCookies(redirectRes);
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
