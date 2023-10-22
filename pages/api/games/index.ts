import { type Profile } from "@/models/AuthModel";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { type NextApiHandler } from "next";

const getUserGames: NextApiHandler = async (req, res) => {
  const supabase = createServerSupabaseClient({ req, res });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError !== null || user === null) {
    console.error("unable to get user", userError);
    return res.status(400).json({ message: "Unable to get user" });
  }

  const { data: games, error: gamesError } = await supabase
    .from("games")
    .select("*")
    .eq("user_id", user.id);
  if (gamesError !== null || user === null) {
    console.error("unable to get user's games", gamesError);
    return res.status(400).json({ message: "Unable to get user's games" });
  }

  return res.status(200).json({ games });
};

const getGamesByUsername: NextApiHandler = async (req, res) => {
  const {
    query: { username },
  } = req;
  const supabase = createServerSupabaseClient({ req, res });

  if (
    username === undefined ||
    Array.isArray(username) ||
    username.trim().length === 0
  ) {
    console.error("invalid [username] query", req.query);
    return res.status(400).json({ message: "Invalid [username] query" });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, type")
    .eq("username", username)
    .single<Profile>();
  if (profileError !== null) {
    console.error(
      "there is no user with this username.",
      username,
      profileError
    );
    return res
      .status(400)
      .json({ message: "There is no user with this username" });
  }

  if (profile.type === "private") {
    return res.status(400).json({ message: "The user has a private profile." });
  }

  const { data: games, error: gamesError } = await supabase
    .from("games")
    .select("*")
    .eq("username", username);
  if (gamesError !== null) {
    console.error("unable to get user's games", gamesError);
    return res.status(400).json({ message: "Unable to get user's games" });
  }

  return res.status(200).json({ games });
};

const handler: NextApiHandler = async (req, res) => {
  const { method = "[Not Found]" } = req;
  const {
    query: { username },
  } = req;

  const hasUsername = username !== undefined;
  const getGames = hasUsername ? getGamesByUsername : getUserGames;

  switch (method) {
    case "GET":
      return getGames(req, res);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
