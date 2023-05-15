import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { type NextApiHandler } from "next";

const getProfile: NextApiHandler = async (req, res) => {
  const supabase = createServerSupabaseClient({ req, res });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError !== null || user === null) {
    console.error("unable to get user", userError);
    return res.status(400).json({ message: "Unable to get user" });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (profileError !== null) {
    console.error("unable to get profile", profileError);
    return res.status(400).json({ message: "Unable to get profile" });
  }

  return res.status(200).json({ profile });
};

const updateProfile: NextApiHandler = async (req, res) => {
  return res.status(200).json({ message: "PUT: Hello World!" });
};

const handler: NextApiHandler = async (req, res) => {
  const { method = "[Not Found]" } = req;
  switch (method) {
    case "GET":
      return getProfile(req, res);
    case "PUT":
      return updateProfile(req, res);
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
