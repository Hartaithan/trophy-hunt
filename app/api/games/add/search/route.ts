import {
  type AddGameSearchPayload,
  type NewGamePayload,
} from "@/models/GameModel";
import {
  type TitleGroups,
  type TitleTrophiesOptions,
} from "@/models/TrophyModel";
import { createClient } from "@/utils/supabase/server";
import { search as headers } from "@/utils/headers";
import { validatePayload } from "@/utils/payload";
import { cookies } from "next/headers";
import { type AuthorizationPayload, getTitleTrophyGroups } from "psn-api";
import { SEARCH_URL } from "@/constants/api";
import { formatPlatform } from "@/utils/platform";

const getGame = async (id: string): Promise<string | null> => {
  let content: string | null = null;

  if (SEARCH_URL === undefined) {
    console.error("SEARCH_URL not found");
    return content;
  }

  try {
    const fetchUrl = `${SEARCH_URL}/trophies/trophies_list/${id}`;
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
  let body: AddGameSearchPayload | null = null;
  try {
    const request: AddGameSearchPayload = await req.json();
    body = request;
  } catch (error) {
    console.error("request body not found", error);
    return Response.json(
      { message: "Request body not found" },
      { status: 400 },
    );
  }
  const { id, platform, status } = body;

  const access_token = cookies().get("psn-access-token")?.value;
  if (typeof access_token !== "string") {
    console.error("psn-access-token not found", access_token);
    return Response.json(
      { message: "Unable to get access token" },
      { status: 400 },
    );
  }

  if (typeof id !== "string") {
    console.error("invalid id type", id);
    return Response.json({ message: "Invalid id type" }, { status: 400 });
  }

  if (typeof platform !== "string") {
    console.error("invalid platform type", platform);
    return Response.json({ message: "Invalid platform type" }, { status: 400 });
  }

  if (typeof status !== "string") {
    console.error("invalid status type", status);
    return Response.json({ message: "Invalid status type" }, { status: 400 });
  }

  const results = validatePayload(body);
  if (results !== null) {
    console.error("invalid payload", results.errors);
    return Response.json(results, { status: 400 });
  }

  const supabase = createClient(cookies());
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
  if (platform.toLowerCase() !== "ps5") {
    listOptions = { ...listOptions, npServiceName: "trophy" };
  }

  const titleGroups = (await getTitleTrophyGroups(
    authorization,
    code,
    listOptions,
  )) as TitleGroups;
  if ("error" in titleGroups) {
    console.error("unable to get trophy group", titleGroups.error);
    return Response.json(
      { message: "Unable to get trophy groups" },
      { status: 400 },
    );
  }

  const payload: NewGamePayload = {
    title: titleGroups.trophyTitleName,
    image_url: titleGroups.trophyTitleIconUrl,
    platform: formatPlatform(titleGroups.trophyTitlePlatform),
    status,
    user_id: user.id,
    username: profile.username,
    code,
  };
  const { data: newGame, error: newGameError } = await supabase
    .from("games")
    .insert([payload])
    .select("*, position(*)")
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
