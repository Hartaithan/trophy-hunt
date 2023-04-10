import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { type NextApiHandler } from "next";

const getGameById: NextApiHandler = async (req, res) => {
  const {
    query: { id },
  } = req;
  const supabase = createServerSupabaseClient({ req, res });

  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("id", id)
    .single();

  if (error !== null) {
    console.error("Unable to get game by id", id, error);
    return res.status(400).json({ message: "Unable to get game by id", id });
  }

  return res.status(200).json({ game: data });
};

const updateGameById: NextApiHandler = async (req, res) => {
  return res.status(200).json({ message: "Hello world!" });
};

const deleteGameById: NextApiHandler = async (req, res) => {
  return res.status(200).json({ message: "Hello world!" });
};

const handler: NextApiHandler = async (req, res) => {
  const { method = "[Not Found]" } = req;
  switch (method) {
    case "GET":
      return getGameById(req, res);
    case "PUT":
      return updateGameById(req, res);
    case "DELETE":
      return deleteGameById(req, res);
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
