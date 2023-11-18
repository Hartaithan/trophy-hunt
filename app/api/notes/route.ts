import { type NewNotePayload, type AddNotePayload } from "@/models/NoteModel";
import { validatePayload } from "@/utils/payload";
import {
  type User,
  createRouteHandlerClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const GET = async (req: Request): Promise<Response> => {
  const { searchParams } = new URL(req.url);

  const game_id = searchParams.get("game_id");
  if (game_id == null || game_id.length === 0) {
    console.error("game_id query is required", game_id);
    return Response.json(
      { message: "Game ID query is required" },
      { status: 400 },
    );
  }

  const trophy_id = searchParams.get("trophy_id");
  if (trophy_id == null || trophy_id.length === 0) {
    console.error("trophy_id query is required", trophy_id);
    return Response.json(
      { message: "Trophy ID query is required" },
      { status: 400 },
    );
  }

  const supabase = createRouteHandlerClient({ cookies });
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
    return Response.json(
      { message: "There are no notes on this query" },
      { status: 400 },
    );
  }

  return Response.json({ note: data });
};

export const POST = async (req: Request): Promise<Response> => {
  let body: AddNotePayload | null = null;
  try {
    const request: AddNotePayload = await req.json();
    body = request;
  } catch (error) {
    console.error("request body not found", error);
    return Response.json(
      { message: "Request body not found" },
      { status: 400 },
    );
  }

  const results = validatePayload(body, ["game_id", "trophy_id"], ["content"]);
  if (results !== null) {
    console.error("invalid payload", results.errors);
    return Response.json(results, { status: 400 });
  }
  const { game_id, trophy_id, content = null } = body;

  const supabase = createRouteHandlerClient({ cookies });

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
      return Response.json({ message: "Unable to get user" }, { status: 400 });
    }

    if (
      userRes.status === "fulfilled" &&
      (userRes.value.error !== null || userRes.value.data === null)
    ) {
      console.error("unable to get user", userRes.value.error);
      return Response.json({ message: "Unable to get user" }, { status: 400 });
    }

    user = userRes.value.data.user;

    if (gameRes.status === "rejected") {
      console.error("game request rejected");
      return Response.json({ message: "Unable to get game" }, { status: 400 });
    }

    if (gameRes.status === "fulfilled" && gameRes.value.error !== null) {
      console.error("game not exist", game_id, gameRes.value.error);
      return Response.json(
        {
          message: `There is no game with this ID (${game_id})`,
        },
        { status: 400 },
      );
    }

    if (noteRes.status === "rejected") {
      console.error("note request rejected");
      return Response.json({ message: "Unable to get note" }, { status: 400 });
    }

    if (noteRes.status === "fulfilled" && noteRes.value.data != null) {
      return Response.json(
        { message: "There is already a note for this trophy" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("unable to create new note", error);
    return Response.json(
      { message: "Unable to create new note" },
      { status: 400 },
    );
  }

  if (user === null) {
    console.error("user not found");
    return Response.json({ message: "User not found" }, { status: 400 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username, language")
    .eq("id", user.id)
    .single();
  if (profileError !== null || profile === null) {
    console.error("unable to get profile", profileError);
    return Response.json({ message: "Unable to get profile" }, { status: 400 });
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
    return Response.json(
      { message: "Unable to create new note" },
      { status: 400 },
    );
  }

  return Response.json(
    { message: "New note successfully created!", note: newNote },
    { status: 201 },
  );
};
