import { type Profile } from "@/models/AuthModel";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getUserGames = async (): Promise<Response> => {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

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
    .select("*")
    .eq("user_id", user.id);
  if (gamesError !== null || user === null) {
    console.error("unable to get user's games", gamesError);
    return Response.json(
      { message: "Unable to get user's games" },
      { status: 400 },
    );
  }

  return Response.json({ games });
};

const getGamesByUsername = async (req: Request): Promise<Response> => {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  if (
    username === undefined ||
    Array.isArray(username) ||
    username?.trim().length === 0
  ) {
    console.error("invalid [username] query", searchParams);
    return Response.json(
      { message: "Invalid [username] query" },
      { status: 400 },
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, type")
    .eq("username", username)
    .single<Profile>();
  if (profileError !== null) {
    console.error(
      "there is no user with this username.",
      username,
      profileError,
    );
    return Response.json(
      { message: "There is no user with this username" },
      { status: 400 },
    );
  }

  if (profile.type === "private") {
    return Response.json(
      { message: "The user has a private profile." },
      { status: 400 },
    );
  }

  const { data: games, error: gamesError } = await supabase
    .from("games")
    .select("*")
    .eq("username", username);
  if (gamesError !== null) {
    console.error("unable to get user's games", gamesError);
    return Response.json(
      { message: "Unable to get user's games" },
      { status: 400 },
    );
  }

  return Response.json({ games });
};

export const GET = async (req: Request): Promise<Response> => {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  const hasUsername = username != null;
  const getGames = hasUsername ? getGamesByUsername : getUserGames;

  return await getGames(req);
};
