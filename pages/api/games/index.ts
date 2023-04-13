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

const handler: NextApiHandler = async (req, res) => {
  const { method = "[Not Found]" } = req;
  switch (method) {
    case "GET":
      return getUserGames(req, res);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
