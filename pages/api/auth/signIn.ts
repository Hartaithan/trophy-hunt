import { getErrorMessage } from "@/helpers/psn";
import { type ISignUpBody } from "@/models/AuthModel";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { setCookie } from "cookies-next";
import { type NextApiRequest, type NextApiHandler } from "next";
import {
  type AuthTokensResponse,
  exchangeCodeForAccessToken,
  exchangeNpssoForCode,
} from "psn-api";

interface ISignInRequest extends NextApiRequest {
  body: ISignUpBody;
}

const signIn: NextApiHandler = async (req, res) => {
  const { body }: ISignInRequest = req;
  const { email, password, npsso } = body;
  const supabase = createServerSupabaseClient({ req, res });

  if (email === undefined || password === undefined || npsso === undefined) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  let accessCode: string | null = null;
  let authorization: AuthTokensResponse | null = null;

  try {
    accessCode = await exchangeNpssoForCode(npsso);
  } catch (error) {
    console.error("exchange access code error", error);
    const message = getErrorMessage(error, "Unable to get PSN access code");
    return res.status(400).json({ message });
  }

  try {
    authorization = await exchangeCodeForAccessToken(accessCode);
  } catch (error) {
    console.error("exchange access token error", error);
    const message = getErrorMessage(error, "Unable to get PSN access token");
    return res.status(400).json({ message });
  }

  const options = { req, res };
  const { accessToken, expiresIn, refreshToken, refreshTokenExpiresIn } =
    authorization;

  const { error } = await supabase.auth.signInWithPassword({
    email: body.email,
    password: body.password,
  });
  if (error != null) {
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
