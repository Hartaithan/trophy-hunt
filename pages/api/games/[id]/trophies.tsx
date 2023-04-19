import {
  type TitleTrophiesOptions,
  type ITitleGroups,
  type ITitleTrophies,
  type ITitleEarnedTrophies,
  type ITitleEarnedGroups,
  type MergedGroups,
  type MergedTrophies,
  type IFormattedResponse,
  type ITrophy,
  type IGroup,
  type IFormattedTrophies,
  type GroupedTrophies,
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
  type TitleTrophyGroupsResponse,
  type UserTrophyGroupEarningsForTitleResponse,
  type TitleTrophiesResponse,
  type UserTrophiesEarnedForTitleResponse,
} from "psn-api";

const mergeGroups = (
  groups: TitleTrophyGroupsResponse,
  earned: UserTrophyGroupEarningsForTitleResponse | null
): MergedGroups => {
  const empty = { trophyGroups: [] };
  const { trophyGroups: allGroups, ...groupDetails } = groups;
  const { trophyGroups: earnedGroups, ...earnedGroupDetails } = earned ?? empty;
  const mergedGroupDetails = {
    ...groupDetails,
    ...earnedGroupDetails,
  };
  const mergedGroups = allGroups.map((i) => ({
    ...i,
    ...earnedGroups.find((n) => n.trophyGroupId === i.trophyGroupId),
  }));
  return { ...mergedGroupDetails, trophyGroups: mergedGroups };
};

const mergeTrophies = (
  trophies: TitleTrophiesResponse,
  earned: UserTrophiesEarnedForTitleResponse | null
): MergedTrophies => {
  const { trophies: allTrophies, ...trophiesDetails } = trophies;
  const { trophies: earnedTrophies, ...earnedTrophiesDetails } = earned ?? {
    trophies: [],
  };
  const mergedTrophiesDetails = {
    ...trophiesDetails,
    ...earnedTrophiesDetails,
  };
  const mergedTrophies = allTrophies.map((i) => ({
    ...i,
    ...earnedTrophies.find((n) => n.trophyId === i.trophyId),
  }));
  return { ...mergedTrophiesDetails, trophies: mergedTrophies };
};

const formatTrophies = (trophies: MergedTrophies): IFormattedTrophies => {
  const array = [...trophies.trophies];
  const formatted: ITrophy[] = [];
  const grouped: GroupedTrophies = {};
  for (let i = 0; i < array.length; i++) {
    const el = array[i];
    const trophy = {
      id: el.trophyId,
      hidden: el.trophyHidden,
      type: el.trophyType,
      name: el.trophyName,
      detail: el.trophyDetail,
      icon_url: el.trophyIconUrl,
      group_id: el.trophyGroupId,
      earned: el.earned,
      rare: el.trophyRare,
      earnedRate: el.trophyEarnedRate,
    };
    formatted.push(trophy);
    if (el.trophyGroupId != null) {
      const list = grouped[el.trophyGroupId] ?? [];
      list.push(trophy);
      grouped[el.trophyGroupId] = list;
    }
  }
  return { grouped, trophies: formatted };
};

const formatGroups = (
  groups: MergedGroups,
  trophies: GroupedTrophies
): IGroup[] => {
  const array = [...groups.trophyGroups];
  const formatted: IGroup[] = [];
  for (let i = 0; i < array.length; i++) {
    const el = array[i];
    formatted.push({
      id: el.trophyGroupId,
      name: el.trophyGroupName,
      detail: el.trophyGroupDetail,
      icon_url: el.trophyGroupIconUrl,
      counts: el.definedTrophies,
      earned_counts: el.earnedTrophies,
      trophies: trophies[el.trophyGroupId],
    });
  }
  return formatted;
};

const formatResponse = (
  groups: MergedGroups,
  trophies: MergedTrophies
): IFormattedResponse => {
  const {
    trophyTitleName,
    trophyTitleDetail,
    trophyTitleIconUrl,
    trophyTitlePlatform,
    definedTrophies,
    earnedTrophies,
  } = groups;
  const { trophies: formattedTrophies, grouped } = formatTrophies(trophies);
  const formattedGroups = formatGroups(groups, grouped);
  return {
    name: trophyTitleName,
    detail: trophyTitleDetail,
    icon_url: trophyTitleIconUrl,
    platform: trophyTitlePlatform,
    counts: definedTrophies,
    earned_counts: earnedTrophies,
    groups: formattedGroups,
    trophies: formattedTrophies,
  };
};

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

  const formattedResponse = formatResponse(mergedGroups, mergedTrophies);

  return res.status(200).json({ ...formattedResponse });
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
