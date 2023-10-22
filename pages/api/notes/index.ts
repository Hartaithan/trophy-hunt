import { validatePayload } from "@/helpers/payload";
import { type NewNotePayload, type AddNotePayload } from "@/models/NoteModel";
import {
  type User,
  createServerSupabaseClient,
} from "@supabase/auth-helpers-nextjs";
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
  const { game_id, trophy_id, content = null } = req.body as AddNotePayload;
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

  const matcher = { game_id, trophy_id };
  let user: User | null = null;

  try {
    const [userRes, gameRes, noteRes] = await Promise.allSettled([
      supabase.auth.getUser(),
      supabase.from("games").select("id").eq("id", game_id).single(),
      supabase.from("notes").select("id").match(matcher).single(),
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

    if (gameRes.status === "rejected") {
      console.error("game request rejected");
      return res.status(400).json({ message: "Unable to get game" });
    }

    if (gameRes.status === "fulfilled" && gameRes.value.error !== null) {
      console.error("game not exist", game_id, gameRes.value.error);
      return res
        .status(400)
        .json({ message: `There is no game with this ID (${game_id})` });
    }

    if (noteRes.status === "rejected") {
      console.error("note request rejected");
      return res.status(400).json({ message: "Unable to get note" });
    }

    if (noteRes.status === "fulfilled" && noteRes.value.data != null) {
      return res
        .status(400)
        .json({ message: "There is already a note for this trophy" });
    }
  } catch (error) {
    console.error("unable to create new note", error);
    return res.status(400).json({ message: "Unable to create new note" });
  }

  if (user === null) {
    console.error("user not found");
    return res.status(400).json({ message: "User not found" });
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

  const payload: NewNotePayload = {
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
    console.error("unable to create new note", newNoteError);
    return res.status(400).json({ message: "Unable to create new note" });
  }

  return res
    .status(201)
    .json({ message: "New note successfully created!", note: newNote });
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
