import { validatePayload } from "@/helpers/payload";
import { type IGame } from "@/models/GameModel";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { type User } from "@supabase/supabase-js";
import { type NextApiHandler } from "next";

const getGameById: NextApiHandler = async (req, res) => {
  const {
    query: { id },
  } = req;
  const supabase = createServerSupabaseClient({ req, res });

  if (id === undefined || Array.isArray(id)) {
    console.error("invalid [id] query", req.query);
    return res.status(400).json({ message: "Invalid [id] query" });
  }

  let user: User | null = null;
  let game: IGame | null = null;
  const [userRes, gameRes] = await Promise.allSettled([
    await supabase.auth.getUser(),
    await supabase.from("games").select("*").eq("id", id).single<IGame>(),
  ]);

  if (userRes.status === "rejected") {
    console.error("user request rejected");
    return res.status(400).json({ message: "Unable to get user" });
  }

  if (
    userRes.status === "fulfilled" &&
    (userRes.value.error !== null || userRes.value.data === null)
  ) {
    console.error("unable to get user", userRes.value.error);
    return res.status(400).json({ message: "Unable to get user" });
  }

  user = userRes.value.data.user;

  if (user === null) {
    console.error("user is empty", id);
    return res.status(400).json({ message: "Unable to get user" });
  }

  if (gameRes.status === "rejected") {
    console.error("game request rejected");
    return res.status(400).json({ message: "Unable to get game by id", id });
  }

  if (
    gameRes.status === "fulfilled" &&
    (gameRes.value.error !== null || gameRes.value.data === null)
  ) {
    console.error("unable to get game by id", id, gameRes.value.error);
    return res.status(400).json({ message: "Unable to get game by id", id });
  }

  game = gameRes.value.data;

  if (game === null) {
    console.error("game is empty", id);
    return res.status(400).json({ message: "Unable to get game by id", id });
  }

  if (game.user_id !== user.id) {
    console.error("game access is restricted", id);
    return res
      .status(400)
      .json({ message: "You don't have access to this game" });
  }

  return res.status(200).json({ game });
};

const updateGameById: NextApiHandler = async (req, res) => {
  const {
    query: { id },
    body,
  } = req;
  const supabase = createServerSupabaseClient({ req, res });

  if (id === undefined || Array.isArray(id)) {
    console.error("invalid [id] query", req.query);
    return res.status(400).json({ message: "Invalid [id] query" });
  }

  const results = validatePayload(body);
  if (results !== null) {
    console.error("invalid payload", results.errors);
    return res.status(400).json(results);
  }

  const { data, error } = await supabase
    .from("games")
    .update(body)
    .eq("id", id)
    .select("*")
    .single();

  if (error !== null) {
    console.error("unable to update game by id", id, error);
    return res.status(400).json({ message: "Unable to update game by id", id });
  }

  return res
    .status(200)
    .json({ message: "Game successfully updated!", game: data });
};

const deleteGameById: NextApiHandler = async (req, res) => {
  const {
    query: { id },
  } = req;
  const supabase = createServerSupabaseClient({ req, res });

  if (id === undefined || Array.isArray(id)) {
    console.error("invalid [id] query", req.query);
    return res.status(400).json({ message: "Invalid [id] query" });
  }

  const { error } = await supabase.from("games").delete().eq("id", id);

  if (error !== null) {
    console.error("unable to delete game by id", id, error);
    return res.status(400).json({ message: "Unable to delete game by id", id });
  }

  return res.status(200).json({ message: "Game successfully deleted!", id });
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
