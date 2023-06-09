import { validatePayload } from "@/helpers/payload";
import { type INewGamePayload, type IAddGamePayload } from "@/models/GameModel";
import {
  type ITitleGroups,
  type TitleTrophiesOptions,
} from "@/models/TrophyModel";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { getCookie } from "cookies-next";
import { type NextApiHandler } from "next";
import { getTitleTrophyGroups, type AuthorizationPayload } from "psn-api";
import { search as headers } from "@/helpers/headers";

const SEARCH_URL = process.env.NEXT_PUBLIC_SEARCH_URL;

interface ISplittedId {
  id: string | null;
  platform: string | null;
}

const splitId = (game: string): ISplittedId => {
  let platform: ISplittedId = { id: null, platform: null };
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
    game = await fetch(fetchUrl, { headers }).then(async (r) => await r.json());
  } catch (error) {
    console.error("get game content error", error);
  }

  if (game == null) return content;

  try {
    const fetchUrl = `${SEARCH_URL}/trophies/trophies_list/${game.id}`;
    const response = await fetch(fetchUrl, { headers }).then(
      async (r) => await r.json()
    );
    content = response.length > 0 ? response[0].image : null;
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

const addGame: NextApiHandler = async (req, res) => {
  const { game_id, status } = req.body as IAddGamePayload;
  const options = { req, res };
  const access_token = getCookie("psn-access-token", options);
  const supabase = createServerSupabaseClient({ req, res });

  if (typeof access_token !== "string") {
    console.error("psn-access-token not found", access_token);
    return res.status(400).json({ message: "Unable to get access token" });
  }

  if (typeof game_id !== "string") {
    console.error("invalid game_id type", game_id);
    return res.status(400).json({ message: "Invalid game_id type" });
  }

  const results = validatePayload(req.body);
  if (results !== null) {
    console.error("invalid payload", results.errors);
    return res.status(400).json(results);
  }

  const { id, platform } = splitId(game_id);
  if (id === null || platform === null) {
    console.error("unable to get id or platform", game_id);
    return res.status(400).json({ message: "Unable to get id or platform" });
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError !== null || user === null) {
    console.error("unable to get user", userError);
    return res.status(400).json({ message: "Unable to get user" });
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

  const game = await getGame(id);
  const code = getCode(game);
  if (game === null || game.length === 0 || code === null) {
    console.error("unable to find game code", id, code);
    return res.status(400).json({ message: "Unable to find game code" });
  }

  const authorization: AuthorizationPayload = { accessToken: access_token };

  const language = profile.language ?? "en-US";
  let listOptions: Partial<TitleTrophiesOptions> = {
    headerOverrides: { "Accept-Language": language },
  };
  if (platform !== "ps5") {
    listOptions = { ...listOptions, npServiceName: "trophy" };
  }

  let titleGroups: ITitleGroups | null = null;
  try {
    titleGroups = await getTitleTrophyGroups(authorization, code, listOptions);
  } catch (error) {
    console.error("unable to get trophy group", error);
    return res.status(400).json({ message: "Unable to get trophy groups" });
  }

  const payload: INewGamePayload = {
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
    return res.status(400).json({ message: "Unable to create new game" });
  }

  return res
    .status(201)
    .json({ message: "New game successfully created!", game: newGame });
};

const handler: NextApiHandler = async (req, res) => {
  const { method = "[Not Found]" } = req;
  switch (method) {
    case "POST":
      return addGame(req, res);
    default:
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
