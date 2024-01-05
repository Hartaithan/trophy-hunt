import { type Params } from "@/models/AppModel";
import { type Game } from "@/models/GameModel";
import { createClient } from "@/utils/supabase/server";
import { validatePayload } from "@/utils/payload";
import { type User } from "@supabase/supabase-js";
import { cookies } from "next/headers";

interface GameParams {
  id: string;
}

export const GET = async (
  _req: Request,
  { params }: Params<GameParams>,
): Promise<Response> => {
  const { id } = params;

  if (id == null || Array.isArray(id)) {
    console.error("invalid [id] query", id);
    return Response.json({ message: "Invalid [id] query" }, { status: 400 });
  }

  let user: User | null = null;
  let game: Game | null = null;
  const supabase = createClient(cookies());
  const [userRes, gameRes] = await Promise.allSettled([
    await supabase.auth.getUser(),
    await supabase
      .from("games")
      .select("*, position(*)")
      .eq("id", id)
      .single<Game>(),
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

  if (user === null) {
    console.error("user is empty", id);
    return Response.json({ message: "Unable to get user" }, { status: 400 });
  }

  if (gameRes.status === "rejected") {
    console.error("game request rejected");
    return Response.json(
      { message: "Unable to get game by id", id },
      { status: 400 },
    );
  }

  if (
    gameRes.status === "fulfilled" &&
    (gameRes.value.error !== null || gameRes.value.data === null)
  ) {
    console.error("unable to get game by id", id, gameRes.value.error);
    return Response.json(
      { message: "Unable to get game by id", id },
      { status: 400 },
    );
  }

  game = gameRes.value.data;

  if (game === null) {
    console.error("game is empty", id);
    return Response.json(
      { message: "Unable to get game by id", id },
      { status: 400 },
    );
  }

  if (game.user_id !== user.id) {
    console.error("game access is restricted", id);
    return Response.json(
      { message: "You don't have access to this game" },
      { status: 400 },
    );
  }

  return Response.json({ game });
};

export const PUT = async (
  req: Request,
  { params }: Params<GameParams>,
): Promise<Response> => {
  const { id } = params;

  let body: Partial<Game> | null = null;
  try {
    const request: Partial<Game> = await req.json();
    body = request;
  } catch (error) {
    console.error("request body not found", error);
    return Response.json(
      { message: "Request body not found" },
      { status: 400 },
    );
  }

  if (id === undefined || Array.isArray(id)) {
    console.error("invalid [id] query", id);
    return Response.json({ message: "Invalid [id] query" }, { status: 400 });
  }

  const results = validatePayload(body);
  if (results !== null) {
    console.error("invalid payload", results.errors);
    return Response.json(results, { status: 400 });
  }

  const supabase = createClient(cookies());
  const { data, error } = await supabase
    .from("games")
    .update(body)
    .eq("id", id)
    .select("*, position(*)")
    .single();

  if (error !== null) {
    console.error("unable to update game by id", id, error);
    return Response.json(
      { message: "Unable to update game by id", id },
      { status: 400 },
    );
  }

  return Response.json({
    message: "Game successfully updated!",
    game: data,
  });
};

export const DELETE = async (
  _req: Request,
  { params }: Params<GameParams>,
): Promise<Response> => {
  const { id } = params;

  if (id === undefined || Array.isArray(id)) {
    console.error("invalid [id] query", id);
    return Response.json({ message: "Invalid [id] query" }, { status: 400 });
  }

  const supabase = createClient(cookies());
  const { error } = await supabase.from("games").delete().eq("id", id);

  if (error !== null) {
    console.error("unable to delete game by id", id, error);
    return Response.json(
      { message: "Unable to delete game by id", id },
      { status: 400 },
    );
  }

  return Response.json({ message: "Game successfully deleted!", id });
};
