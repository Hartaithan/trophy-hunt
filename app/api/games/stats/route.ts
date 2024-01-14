import { type Game } from "@/models/GameModel";
import { initializeBoardStats } from "@/utils/board";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const GET = async (): Promise<Response> => {
  const supabase = createClient(cookies());

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError !== null || user === null) {
    console.error("unable to get user", userError);
    return Response.json({ message: "Unable to get user" }, { status: 400 });
  }

  const { data: games, error: gamesError } = await supabase
    .from("games")
    .select("id, status")
    .eq("user_id", user.id)
    .returns<Game[]>();
  if (gamesError !== null || user === null) {
    console.error("unable to get user's games", gamesError);
    return Response.json(
      { message: "Unable to get user's games" },
      { status: 400 },
    );
  }

  const columns = initializeBoardStats(games);

  return Response.json(columns);
};
