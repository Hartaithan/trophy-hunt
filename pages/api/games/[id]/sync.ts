import { mergeTrophies } from "@/helpers/psn";
import { type ProgressItem } from "@/models/ProgressModel";
import {
  type TitleTrophies,
  type TitleEarnedTrophies,
  type TitleTrophiesOptions,
} from "@/models/TrophyModel";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { getCookie } from "cookies-next";
import { type NextApiHandler } from "next";
import {
  getUserTrophiesEarnedForTitle,
  type AuthorizationPayload,
  getTitleTrophies,
} from "psn-api";

const syncGameProgress: NextApiHandler = async (req, res) => {
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
    console.error("invalid [id] query", req.query);
    return res.status(400).json({ message: "Invalid [id] query" });
  }

  const { data: game, error: gameError } = await supabase
    .from("games")
    .select("*")
    .eq("id", id)
    .single();
  if (gameError !== null) {
    console.error("unable to update game by id", id, gameError);
    return res.status(400).json({ message: "Unable to update game by id", id });
  }

  const auth: AuthorizationPayload = { accessToken: access_token };
  const code = game.code;
  let options: Partial<TitleTrophiesOptions> = {};
  if (game.platform !== "ps5") {
    options = { ...options, npServiceName: "trophy" };
  }

  type Response = [
    PromiseSettledResult<TitleTrophies>,
    PromiseSettledResult<TitleEarnedTrophies>
  ];

  let titleTrophies: TitleTrophies | null = null;
  let titleEarnedTrophies: TitleEarnedTrophies | null = null;

  const [resTrophies, resEarned]: Response = await Promise.allSettled([
    getTitleTrophies(auth, code, "all", options),
    getUserTrophiesEarnedForTitle(auth, "me", code, "all", options),
  ]);

  if (resTrophies.status === "fulfilled" && !("error" in resTrophies.value)) {
    titleTrophies = resTrophies.value;
  }

  if (resEarned.status === "fulfilled" && !("error" in resEarned.value)) {
    titleEarnedTrophies = resEarned.value;
  }

  if (titleTrophies === null) {
    console.error("unable to get trophies");
    return res.status(400).json({ message: "Unable to get trophies" });
  }

  if (titleEarnedTrophies === null) {
    console.error("unable to get earned trophies");
    return res.status(400).json({
      message:
        "Unable to get earned trophies, you probably don't have this game on your account.",
    });
  }

  const mergedTrophies = mergeTrophies(titleTrophies, titleEarnedTrophies);

  const trophies = [...mergedTrophies.trophies] ?? [];
  const progress: ProgressItem[] = trophies.map((i) => ({
    id: i.trophyId,
    earned: i.earned ?? false,
    group: i.trophyGroupId ?? "default",
    dlc: i.trophyGroupId === undefined ? false : i.trophyGroupId !== "default",
  }));

  const { data: updateData, error: updateError } = await supabase
    .from("games")
    .update({ progress })
    .eq("id", id)
    .select("progress")
    .single();
  if (updateError !== null) {
    console.error("unable to update game progress", id, updateError);
    return res
      .status(400)
      .json({ message: "Unable to update game progress", id });
  }

  return res.status(200).json({
    message: "Game progress successfully synced!",
    progress: updateData.progress,
  });
};

const handler: NextApiHandler = async (req, res) => {
  const { method = "[Not Found]" } = req;
  switch (method) {
    case "GET":
      return syncGameProgress(req, res);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
