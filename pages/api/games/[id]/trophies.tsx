import { getErrorMessage } from "@/helpers/psn";
import {
  type TitleTrophiesOptions,
  type ITitleGroups,
  type ITitleTrophies,
  type ITitleEarnedTrophies,
} from "@/models/TrophyModel";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { getCookie } from "cookies-next";
import { type NextApiHandler } from "next";
import {
  getTitleTrophyGroups,
  type AuthorizationPayload,
  getTitleTrophies,
  getUserTrophiesEarnedForTitle,
} from "psn-api";

const getGameTrophies: NextApiHandler = async (req, res) => {
  const {
    query: { id },
  } = req;
  const supabase = createServerSupabaseClient({ req, res });
  const access_token = getCookie("psn-access-token", { req, res });

  if (typeof access_token !== "string") {
    console.error("psn-access-token not found");
    return res.status(400).json({ message: "Unable to get access token" });
  }

  if (id === undefined || Array.isArray(id)) {
    console.error("invalid [id] query", id);
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

  const auth: AuthorizationPayload = { accessToken: access_token };

  const lang = user.data.user.user_metadata.lang ?? "en-en";
  const code = game.data.code;
  let options: Partial<TitleTrophiesOptions> = {
    headerOverrides: { "Accept-Language": lang },
  };
  if (game.data.platform !== "ps5") {
    options = { ...options, npServiceName: "trophy" };
  }

  type Response = [
    PromiseSettledResult<ITitleGroups>,
    PromiseSettledResult<ITitleTrophies>,
    PromiseSettledResult<ITitleEarnedTrophies>
  ];
  let groups: ITitleGroups | null = null;
  let trophies: ITitleTrophies | null = null;
  let earned: ITitleEarnedTrophies | null = null;
  const [resGroups, resTrophies, resEarned]: Response =
    await Promise.allSettled([
      getTitleTrophyGroups(auth, code, options),
      getTitleTrophies(auth, code, "all", options),
      getUserTrophiesEarnedForTitle(auth, "me", code, "all", options),
    ]);
  if (resGroups.status === "fulfilled" && resGroups.value.error == null) {
    groups = resGroups.value;
  }
  if (resGroups.status === "fulfilled" && resGroups.value.error != null) {
    const { value } = resGroups;
    const defaultMessage = "Unable to get trophy groups";
    console.error("unable to get trophy groups", value.error);
    const message = getErrorMessage(value.error, defaultMessage);
    return res.status(400).json({ message });
  }
  if (resTrophies.status === "fulfilled" && resTrophies.value.error == null) {
    trophies = resTrophies.value;
  }
  if (resTrophies.status === "fulfilled" && resTrophies.value.error != null) {
    const { value } = resTrophies;
    console.error("unable to get trophies", value.error);
    const message = getErrorMessage(value.error, "Unable to get trophies");
    return res.status(400).json({ message });
  }
  if (resEarned.status === "fulfilled" && resEarned.value.error == null) {
    earned = resEarned.value;
  }

  return res.status(200).json({ groups, trophies, earned });
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
