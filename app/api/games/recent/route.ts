import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const GET = async (req: Request): Promise<Response> => {
  const supabase = createClient(cookies());
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("limit");
  const limit = query != null ? Number(query) : 5;

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
    .order("updated_at", { ascending: false })
    .limit(limit);
  if (gamesError !== null || user === null) {
    console.error("unable to get user's games", gamesError);
    return Response.json(
      { message: "Unable to get user's games" },
      { status: 400 },
    );
  }

  return Response.json({ games });
};
