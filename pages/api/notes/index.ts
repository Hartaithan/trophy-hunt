import { validatePayload } from "@/helpers/payload";
import { type INewNotePayload, type IAddNotePayload } from "@/models/NoteModel";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { type NextApiHandler } from "next";

const getNoteByGame: NextApiHandler = async (req, res) => {
  const {
    query: { game_id, trophy_id },
  } = req;
  const supabase = createServerSupabaseClient({ req, res });

  const results = validatePayload(req.query, ["game_id", "trophy_id"]);
  if (results !== null) {
    console.error("invalid queries", results.errors);
    return res.status(400).json(results);
  }

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .match({
      game_id,
      trophy_id,
    })
    .single();
  if (error !== null) {
    console.error("note not exist", game_id, error);
    return res
      .status(400)
      .json({ message: "There are no notes on this query" });
  }

  return res.status(200).json({ note: data });
};

const addNote: NextApiHandler = async (req, res) => {
  const { game_id, trophy_id, content = null } = req.body as IAddNotePayload;
  const supabase = createServerSupabaseClient({ req, res });

  const results = validatePayload(
    req.body,
    ["game_id", "trophy_id"],
    ["content"]
  );
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

  const { error: gameError } = await supabase
    .from("games")
    .select("id")
    .eq("id", game_id)
    .single();
  if (gameError !== null || user === null) {
    console.error("game not exist", game_id, gameError);
    return res
      .status(400)
      .json({ message: `There is no game with this ID (${game_id})` });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username, language")
    .eq("id", user.id)
    .single();
  if (profileError !== null || profile === null) {
    console.error("unable to get profile", profileError);
    return res.status(400).json({ message: "Unable to get profile" });
  }

  const payload: INewNotePayload = {
    game_id,
    trophy_id,
    content,
    user_id: user.id,
    username: profile.username,
  };
  const { data: newNote, error: newNoteError } = await supabase
    .from("notes")
    .insert([payload])
    .select("*")
    .single();
  if (newNoteError !== null) {
    let message = "Unable to create new note";
    if (newNoteError.code === "23505") {
      message = "There is already a note for this trophy";
    }
    console.error("unable to create new note", newNoteError);
    return res.status(400).json({ message });
  }

  return res
    .status(201)
    .json({ message: "New note successfully created!", game: newNote });
};

const handler: NextApiHandler = async (req, res) => {
  const { method = "[Not Found]" } = req;
  switch (method) {
    case "GET":
      return getNoteByGame(req, res);
    case "POST":
      return addNote(req, res);
    default:
      res.setHeader("Allow", ["POST", "GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
