import { validatePayload } from "@/helpers/payload";
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
    console.error("unable to get game by id", id, error);
    return res.status(400).json({ message: "Unable to get game by id", id });
  }

  return res.status(200).json({ game: data });
};

const updateGameById: NextApiHandler = async (req, res) => {
  const {
    query: { id },
    body,
  } = req;
  const supabase = createServerSupabaseClient({ req, res });

  const results = validatePayload(body);
  if (results !== null) {
    console.error("invalid payload", results.errors);
    return res.status(400).json(results);
  }

  const { data, error } = await supabase
    .from("games")
    .update(body)
    .eq("id", id)
    .single();

  if (error !== null) {
    console.error("unable to update game by id", id, error);
    return res.status(400).json({ message: "Unable to update game by id", id });
  }

  return res
    .status(204)
    .json({ message: "Game successfully updated!", game: data });
};

const deleteGameById: NextApiHandler = async (req, res) => {
  const {
    query: { id },
  } = req;
  const supabase = createServerSupabaseClient({ req, res });

  const { error } = await supabase.from("games").delete().eq("id", id);

  if (error !== null) {
    console.error("unable to delete game by id", id, error);
    return res.status(400).json({ message: "Unable to delete game by id", id });
  }

  return res.status(204).json({ message: "Game successfully deleted!", id });
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
