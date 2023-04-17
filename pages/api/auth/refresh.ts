import { type NullableAuthResponse } from "@/models/AuthModel";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { getCookie, setCookie } from "cookies-next";
import { type NextApiHandler } from "next";
import { exchangeRefreshTokenForAuthTokens } from "psn-api";

const refreshToken: NextApiHandler = async (req, res) => {
  const options = { req, res };
  const supabase = createServerSupabaseClient(options);
  const refresh_token = getCookie("psn-refresh-token", options);

  if (typeof refresh_token !== "string") {
    console.error("psn-refresh-token not found", refresh_token);
    return res.status(400).json({ message: "Unable to get refresh token" });
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError !== null || user === null) {
    console.error("unable to get user", userError);
    return res.status(400).json({ message: "Unable to get user" });
  }

  let authorization: NullableAuthResponse = null;
  try {
    authorization = await exchangeRefreshTokenForAuthTokens(refresh_token);
  } catch (error) {
    console.error("unable to refresh tokens", error);
  }

  if (authorization == null) {
    return res.status(400).json({ message: "Unable to refresh tokens" });
  }

  const { accessToken, expiresIn } = authorization;
  setCookie("psn-access-token", accessToken, {
    ...options,
    maxAge: expiresIn,
  });

  return res.status(200).json({ message: "Tokens successfully refreshed!" });
};

const handler: NextApiHandler = async (req, res) => {
  const { method = "[Not Found]" } = req;
  switch (method) {
    case "GET":
      return refreshToken(req, res);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
