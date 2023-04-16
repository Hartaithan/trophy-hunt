import { getErrorMessage } from "@/helpers/psn";
import {
  type TitleTrophiesOptions,
  type ITitleGroups,
  type ITitleTrophies,
} from "@/models/TrophyModel";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { getCookie } from "cookies-next";
import { type NextApiHandler } from "next";
import {
  getTitleTrophyGroups,
  type AuthorizationPayload,
  getTitleTrophies,
} from "psn-api";

const getGameTrophies: NextApiHandler = async (req, res) => {
  const {
    query: { id },
  } = req;
  const options = { req, res };
  const supabase = createServerSupabaseClient({ req, res });
  const access_token = getCookie("psn-access-token", options);

  if (typeof access_token !== "string") {
    return res.status(400).json({ message: "Unable to get access token" });
  }

  if (id === undefined || Array.isArray(id)) {
    return res.status(400).json({ message: "Invalid [id] query" });
  }

  const [user, game] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("games").select("*").eq("id", id).single(),
  ]);

  if (user.error !== null || user === null) {
    console.error("unable to get user", user.error);
    return res.status(400).json({ message: "Unable to get user" });
  }
  if (game.error !== null) {
    console.error("unable to update game by id", id, game.error);
    return res.status(400).json({ message: "Unable to update game by id", id });
  }

  const authorization: AuthorizationPayload = { accessToken: access_token };

  const lang = user.data.user.user_metadata.lang ?? "en-en";
  const code = game.data.code;
  let listOptions: Partial<TitleTrophiesOptions> = {
    headerOverrides: { "Accept-Language": lang },
  };
  if (game.data.platform !== "ps5") {
    listOptions = { ...listOptions, npServiceName: "trophy" };
  }

  const [groups, trophies]: [ITitleGroups, ITitleTrophies] = await Promise.all([
    getTitleTrophyGroups(authorization, code, listOptions),
    getTitleTrophies(authorization, code, "all", listOptions),
  ]);
  if (groups.error != null) {
    const defaultMessage = "Unable to get trophy groups";
    const message = getErrorMessage(groups.error, defaultMessage);
    return res.status(400).json({ message });
  }
  if (trophies.error != null) {
    const message = getErrorMessage(trophies.error, "Unable to get trophies");
    return res.status(400).json({ message });
  }

  return res.status(200).json({ message: "Hello world!", groups, trophies });
};

const handler: NextApiHandler = async (req, res) => {
  const { method = "[Not Found]" } = req;
  switch (method) {
    case "GET":
      return getGameTrophies(req, res);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
