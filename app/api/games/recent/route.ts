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
    .select("*, position(*)")
    .eq("user_id", user.id)
    .not("updated_at", "is", null)
    .order("updated_at", { ascending: false });
  if (gamesError !== null || user === null) {
    console.error("unable to get user's games", gamesError);
    return Response.json(
      { message: "Unable to get user's games" },
      { status: 400 },
    );
  }

  return Response.json({ games });
};
