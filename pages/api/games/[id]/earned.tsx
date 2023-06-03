import {
  formatEarnedResponse,
  mergeGroups,
  mergeTrophies,
} from "@/helpers/psn";
import {
  type TitleTrophiesOptions,
  type ITitleGroups,
  type ITitleTrophies,
  type ITitleEarnedTrophies,
  type ITitleEarnedGroups,
} from "@/models/TrophyModel";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { getCookie } from "cookies-next";
import { type NextApiHandler } from "next";
import {
  getTitleTrophyGroups,
  type AuthorizationPayload,
  getTitleTrophies,
  getUserTrophiesEarnedForTitle,
  getUserTrophyGroupEarningsForTitle,
} from "psn-api";

const getEarnedTrophies: NextApiHandler = async (req, res) => {
  const {
    query: { id, withTrophies },
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

  const language = user.data.user.user_metadata.language ?? "en-en";
  const code = game.data.code;
  let options: Partial<TitleTrophiesOptions> = {
    headerOverrides: { "Accept-Language": language },
  };
  if (game.data.platform !== "ps5") {
    options = { ...options, npServiceName: "trophy" };
  }

  type Response = [
    PromiseSettledResult<ITitleGroups>,
    PromiseSettledResult<ITitleEarnedGroups>,
    PromiseSettledResult<ITitleTrophies>,
    PromiseSettledResult<ITitleEarnedTrophies>
  ];
  let titleGroups: ITitleGroups | null = null;
  let titleEarnedGroups: ITitleEarnedGroups | null = null;
  let titleTrophies: ITitleTrophies | null = null;
  let titleEarnedTrophies: ITitleEarnedTrophies | null = null;
  const [resGroups, resGroupsEarned, resTrophies, resEarned]: Response =
    await Promise.allSettled([
      getTitleTrophyGroups(auth, code, options),
      getUserTrophyGroupEarningsForTitle(auth, "me", code, options),
      getTitleTrophies(auth, code, "all", options),
      getUserTrophiesEarnedForTitle(auth, "me", code, "all", options),
    ]);

  if (resGroups.status === "fulfilled" && !("error" in resGroups.value)) {
    titleGroups = resGroups.value;
  }

  if (resTrophies.status === "fulfilled" && !("error" in resTrophies.value)) {
    titleTrophies = resTrophies.value;
  }

  if (resEarned.status === "fulfilled" && !("error" in resEarned.value)) {
    titleEarnedTrophies = resEarned.value;
  }

  if (
    resGroupsEarned.status === "fulfilled" &&
    !("error" in resGroupsEarned.value)
  ) {
    titleEarnedGroups = resGroupsEarned.value;
  }

  if (titleGroups === null || titleTrophies === null) {
    const defaultMessage = "Unable to get trophies and trophy groups";
    console.error("unable to get trophies");
    return res.status(400).json({ message: defaultMessage });
  }

  const mergedGroups = mergeGroups(titleGroups, titleEarnedGroups);
  const mergedTrophies = mergeTrophies(titleTrophies, titleEarnedTrophies);

  const formattedResponse = formatEarnedResponse(
    mergedGroups,
    mergedTrophies,
    withTrophies !== undefined
  );

  return res.status(200).json({ ...formattedResponse });
};

const handler: NextApiHandler = async (req, res) => {
  const { method = "[Not Found]" } = req;
  switch (method) {
    case "GET":
      return getEarnedTrophies(req, res);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
