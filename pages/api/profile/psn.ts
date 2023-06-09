import { type NextApiHandler } from "next";
import { type AuthorizationPayload, getProfileFromUserName } from "psn-api";
import { getCookie } from "cookies-next";

const getPSNProfile: NextApiHandler = async (req, res) => {
  const options = { req, res };
  const access_token = getCookie("psn-access-token", options);

  if (typeof access_token !== "string") {
    console.error("psn-access-token not found", access_token);
    return res.status(400).json({ message: "Unable to get access token" });
  }

  const authorization: AuthorizationPayload = { accessToken: access_token };
  try {
    const { profile } = await getProfileFromUserName(authorization, "me");
    return res.status(200).json({ profile });
  } catch (error) {
    console.error("unable to get profile", error);
    return res.status(400).json({ message: "Unable to get profile" });
  }
};

const handler: NextApiHandler = async (req, res) => {
  const { method = "[Not Found]" } = req;
  switch (method) {
    case "GET":
      return getPSNProfile(req, res);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
