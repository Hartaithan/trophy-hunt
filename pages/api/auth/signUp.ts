import { validatePayload } from "@/helpers/payload";
import { type ISignUpBody } from "@/models/AuthModel";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { deleteCookie, setCookie } from "cookies-next";
import { type NextApiRequest, type NextApiHandler } from "next";
import { type AuthTokensResponse } from "psn-api";
import {
  exchangeCodeForAccessToken,
  exchangeNpssoForCode,
  getProfileFromUserName,
} from "psn-api";

const REDIRECT_URL = process.env.NEXT_PUBLIC_REDIRECT_URL;

interface ISignUpRequest extends NextApiRequest {
  body: ISignUpBody;
}

const signUp: NextApiHandler = async (req, res) => {
  const { body }: ISignUpRequest = req;
  const { email, password, npsso, lang } = body;
  const supabase = createServerSupabaseClient({ req, res });

  const results = validatePayload(body);
  if (results !== null) {
    console.error("invalid payload", results.errors);
    return res.status(400).json(results);
  }

  let accessCode: string | null = null;
  let authorization: AuthTokensResponse | null = null;

  try {
    accessCode = await exchangeNpssoForCode(npsso);
  } catch (error) {
    console.error("exchange access code error", error);
    return res.status(400).json({ message: "Unable to get PSN access code" });
  }

  try {
    authorization = await exchangeCodeForAccessToken(accessCode);
  } catch (error) {
    console.error("exchange access token error", error);
    return res.status(400).json({ message: "Unable to get PSN access token" });
  }

  const options = { req, res };
  const { accessToken, expiresIn, refreshToken, refreshTokenExpiresIn } =
    authorization;
  setCookie("psn-access-token", accessToken, { ...options, maxAge: expiresIn });
  setCookie("psn-refresh-token", refreshToken, {
    ...options,
    maxAge: refreshTokenExpiresIn,
  });

  const { profile } = await getProfileFromUserName(authorization, "me");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { onlineId: profile.onlineId, lang },
      emailRedirectTo: REDIRECT_URL,
    },
  });
  if (error != null) {
    deleteCookie("psn-access-token");
    deleteCookie("psn-refresh-token");
    console.error("unable to sign up", error);
    return res.status(400).json({ message: "Unable to sign up" });
  }
  return res
    .status(201)
    .json({ message: "User successfully created!", user: data.user });
};

const handler: NextApiHandler = async (req, res) => {
  const { method = "[Not Found]" } = req;
  switch (method) {
    case "POST":
      return signUp(req, res);
    default:
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
