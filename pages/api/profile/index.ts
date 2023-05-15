import { validatePayload } from "@/helpers/payload";
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
  const { body } = req;
  const supabase = createServerSupabaseClient({ req, res });

  const results = validatePayload(body);
  if (results !== null) {
    console.error("invalid payload", results.errors);
    return res.status(400).json(results);
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError !== null || user === null) {
    console.error("unable to get user", userError);
    return res.status(400).json({ message: "Unable to get user" });
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .update(body)
    .eq("id", user.id)
    .select("*")
    .single();

  if (error !== null) {
    console.error("unable to update profile", error);
    return res.status(400).json({ message: "Unable to update profile" });
  }

  return res
    .status(200)
    .json({ message: "Profile successfully updated!", profile });
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
