import { type AddGamePayload, type NewGamePayload } from "@/models/GameModel";
import {
  type TitleGroups,
  type TitleTrophiesOptions,
} from "@/models/TrophyModel";
import { search as headers } from "@/utils/headers";
import { validatePayload } from "@/utils/payload";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { type AuthorizationPayload, getTitleTrophyGroups } from "psn-api";

const SEARCH_URL = process.env.NEXT_PUBLIC_SEARCH_URL;

interface SplittedId {
  id: string | null;
  platform: string | null;
}

const splitId = (game: string): SplittedId => {
  let platform: SplittedId = { id: null, platform: null };
  const splitted = game.split("/");
  if (typeof game !== "string" || !game.includes("/")) {
    console.error("invalid game_id", game);
    return platform;
  }
  if (splitted.length > 0 && splitted.every((i) => i.length > 0)) {
    platform = { platform: splitted[0], id: splitted[1] };
  }
  return platform;
};

const getGame = async (id: string): Promise<string | null> => {
  let game: { id: string } | null = null;
  let content: string | null = null;

  if (SEARCH_URL === undefined) {
    console.error("SEARCH_URL not found");
    return content;
  }

  try {
    const fetchUrl = `${SEARCH_URL}/trophies_list/games/${id}`;
    const response = await fetch(fetchUrl, { headers });
    const data = await response.json();
    if (!response.ok) throw new Error("Unable to find game content");
    game = data;
  } catch (error) {
    console.error("get game content error", error);
  }

  if (game == null) return content;

  try {
    const fetchUrl = `${SEARCH_URL}/trophies/trophies_list/${game.id}`;
    const response = await fetch(fetchUrl, { headers });
    const data = await response.json();
    if (!response.ok) throw new Error("Unable to find game trophy list");
    content = data != null && data.length > 0 ? data[0].image : null;
  } catch (error) {
    console.error("get game list error", error);
  }

  return content;
};

const getCode = (value: string | null): string | null => {
  const searchTag = "NPWR";
  if (value === null) {
    console.error("value not provided", value);
    return null;
  }
  const code = value.substr(value.indexOf(searchTag), 8 + searchTag.length);
  if (code.length !== 12) {
    console.error("invalid code", code);
    return null;
  }
  return code;
};

export const POST = async (req: Request): Promise<Response> => {
  let body: AddGamePayload | null = null;
  try {
    const request: AddGamePayload = await req.json();
    body = request;
  } catch (error) {
    console.error("request body not found", error);
    return Response.json(
      { message: "Request body not found" },
      { status: 400 },
    );
  }
  const { game_id, status } = body;

  const access_token = cookies().get("psn-access-token")?.value;
  if (typeof access_token !== "string") {
    console.error("psn-access-token not found", access_token);
    return Response.json(
      { message: "Unable to get access token" },
      { status: 400 },
    );
  }

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  if (typeof game_id !== "string") {
    console.error("invalid game_id type", game_id);
    return Response.json({ message: "Invalid game_id type" }, { status: 400 });
  }

  const results = validatePayload(body);
  if (results !== null) {
    console.error("invalid payload", results.errors);
    return Response.json(results, { status: 400 });
  }

  const { id, platform } = splitId(game_id);
  if (id === null || platform === null) {
    console.error("unable to get id or platform", game_id);
    return Response.json(
      { message: "Unable to get id or platform" },
      { status: 400 },
    );
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError !== null || user === null) {
    console.error("unable to get user", userError);
    return Response.json({ message: "Unable to get user" }, { status: 400 });
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

  const game = await getGame(id);
  const code = getCode(game);
  if (game === null || game.length === 0 || code === null) {
    console.error("unable to find game code", id, code);
    return Response.json(
      { message: "Unable to find game code" },
      { status: 400 },
    );
  }

  const authorization: AuthorizationPayload = { accessToken: access_token };

  const language = profile.language ?? "en-US";
  let listOptions: Partial<TitleTrophiesOptions> = {
    headerOverrides: { "Accept-Language": language },
  };
  if (platform !== "ps5") {
    listOptions = { ...listOptions, npServiceName: "trophy" };
  }

  let titleGroups: TitleGroups | null = null;
  try {
    titleGroups = await getTitleTrophyGroups(authorization, code, listOptions);
  } catch (error) {
    console.error("unable to get trophy group", error);
    return Response.json(
      { message: "Unable to get trophy groups" },
      { status: 400 },
    );
  }

  const payload: NewGamePayload = {
    title: titleGroups.trophyTitleName,
    image_url: titleGroups.trophyTitleIconUrl,
    platform,
    status,
    user_id: user.id,
    username: profile.username,
    code,
  };
  const { data: newGame, error: newGameError } = await supabase
    .from("games")
    .insert([payload])
    .select("*")
    .single();
  if (newGameError !== null) {
    console.error("unable to create new game", newGameError);
    return Response.json(
      { message: "Unable to create new game" },
      { status: 400 },
    );
  }

  return Response.json(
    {
      message: "New game successfully created!",
      game: newGame,
    },
    { status: 201 },
  );
};
