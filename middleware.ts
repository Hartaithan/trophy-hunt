import { NextResponse, type NextMiddleware } from "next/server";
import { type NullableAuthResponse } from "./models/AuthModel";
import { exchangeRefreshTokenForAuthTokens } from "psn-api";
import { cookies } from "next/headers";
import { createClient } from "./utils/supabase/middleware";

const publicPages = new Set<string>([
  "/signIn",
  "/signUp",
  "/setPassword",
  "/forgot",
]);

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
  console.info("refreshed auth", JSON.stringify(authorization));
  return authorization;
};

const resetCookies = (res: NextResponse): NextResponse => {
  const allCookies = cookies().getAll();
  console.info("cookies before reset", JSON.stringify(allCookies));
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

  const pathname = req.nextUrl.pathname;
  const isPublicPage = publicPages.has(pathname);
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

  console.info(
    "middleware user",
    pathname,
    session?.user?.email,
    session?.expires_at,
    req.headers.get("user-agent"),
  );
  console.info(
    "middleware token",
    access_token !== undefined ? access_token.slice(-5) : undefined,
    refresh_token !== undefined ? refresh_token.slice(-5) : undefined,
    refreshed_auth === null,
  );

  if (!isAuth && isHomePage) {
    return resetCookies(res);
  }

  if (!isAuth && !isPublicPage) {
    const redirectRes = NextResponse.redirect(new URL("/signIn", req.url));
    return resetCookies(redirectRes);
  }

  if (isAuth && isPublicPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (refreshed_auth != null) {
    const { accessToken, expiresIn } = refreshed_auth;
    res.cookies.set("psn-access-token", accessToken, { maxAge: expiresIn });
  }

  return res;
};
