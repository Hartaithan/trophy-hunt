import { validatePayload } from "@/helpers/payload";
import { type SignUpBody } from "@/models/AuthModel";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { setCookie } from "cookies-next";
import { type NextApiRequest, type NextApiHandler } from "next";
import {
  type AuthTokensResponse,
  exchangeCodeForAccessToken,
  exchangeNpssoForCode,
} from "psn-api";

interface SignInRequest extends NextApiRequest {
  body: SignUpBody;
}

const signIn: NextApiHandler = async (req, res) => {
  const { body }: SignInRequest = req;
  const { email, password, npsso } = body;
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

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error != null) {
    console.error("sign in with password error", error);
    return res.status(400).json(error);
  }

  setCookie("psn-access-token", accessToken, { ...options, maxAge: expiresIn });
  setCookie("psn-refresh-token", refreshToken, {
    ...options,
    maxAge: refreshTokenExpiresIn,
  });

  return res.status(200).json({ message: "Successful sign in!" });
};

const handler: NextApiHandler = async (req, res) => {
  const { method = "[Not Found]" } = req;
  switch (method) {
    case "POST":
      return signIn(req, res);
    default:
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
