import { deleteCookie } from "cookies-next";
import { type NextApiHandler } from "next";

const signOut: NextApiHandler = async (req, res) => {
  const options = { req, res };

  try {
    deleteCookie("psn-access-token", options);
    deleteCookie("psn-refresh-token", options);
    deleteCookie("supabase-auth-token", options);
    return res.status(200).json({ message: "Successful sign out!" });
  } catch (error) {
    return res.status(400).json({ message: "Unable to sign out" });
  }
};

const handler: NextApiHandler = async (req, res) => {
  const { method = "[Not Found]" } = req;
  switch (method) {
    case "GET":
      return signOut(req, res);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
