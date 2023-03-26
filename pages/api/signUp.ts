import { getErrorMessage } from "@/helpers/psn";
import { type ISignUpBody } from "@/models/AuthModel";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { setCookie } from "cookies-next";
import { type NextApiRequest, type NextApiHandler } from "next";
import { type AuthTokensResponse } from "psn-api";
import {
  exchangeCodeForAccessToken,
  exchangeNpssoForCode,
  getProfileFromUserName,
} from "psn-api";

interface ISignUpRequest extends NextApiRequest {
  body: ISignUpBody;
}

const signUp: NextApiHandler = async (req, res) => {
  const { body }: ISignUpRequest = req;
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
    const { message } = getErrorMessage(error, "Unable to get PSN access code");
    return res.status(400).json({ message });
  }

  try {
    authorization = await exchangeCodeForAccessToken(accessCode);
  } catch (error) {
    console.error("exchange access token error", error);
    const { message } = getErrorMessage(
      error,
      "Unable to get PSN access token"
    );
    return res.status(400).json({ message });
  }

  const options = { req, res };
  const { accessToken, expiresIn, refreshToken, refreshTokenExpiresIn } =
    authorization;
  setCookie("psn_access", accessToken, { ...options, maxAge: expiresIn });
  setCookie("psn_refresh", refreshToken, {
    ...options,
    maxAge: refreshTokenExpiresIn,
  });

  const { profile } = await getProfileFromUserName(authorization, "me");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { onlineId: profile.onlineId } },
  });
  if (error != null) {
    return res.status(400).json({ message: "Unable to create user", error });
  }
  return res.status(201).json({ message: "User successfully created!" });
};

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case "POST":
      return signUp(req, res);
    default:
      res.setHeader("Allow", ["POST"]);
      return res
        .status(405)
        .end(`Method ${method ?? "[Not Found]"} Not Allowed`);
  }
};

export default handler;
