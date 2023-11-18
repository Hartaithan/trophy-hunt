import { type Params } from "@/models/AppModel";
import { type ProgressItem } from "@/models/ProgressModel";
import {
  type TitleEarnedTrophies,
  type TitleTrophies,
  type TitleTrophiesOptions,
} from "@/models/TrophyModel";
import { mergeTrophies } from "@/utils/psn";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import {
  type AuthorizationPayload,
  getTitleTrophies,
  getUserTrophiesEarnedForTitle,
} from "psn-api";

interface GameParams {
  id: string;
}

export const GET = async (
  _req: Request,
  { params }: Params<GameParams>,
): Promise<Response> => {
  const { id } = params;

  const access_token = cookies().get("psn-access-token")?.value;
  if (typeof access_token !== "string") {
    console.error("psn-access-token not found");
    return Response.json(
      { message: "Unable to get access token" },
      { status: 400 },
    );
  }

  if (id === undefined || Array.isArray(id)) {
    console.error("invalid [id] query", id);
    return Response.json({ message: "Invalid [id] query" }, { status: 400 });
  }

  const supabase = createRouteHandlerClient({ cookies });
  const { data: game, error: gameError } = await supabase
    .from("games")
    .select("*")
    .eq("id", id)
    .single();
  if (gameError !== null) {
    console.error("unable to update game by id", id, gameError);
    return Response.json(
      { message: "Unable to update game by id", id },
      { status: 400 },
    );
  }

  const auth: AuthorizationPayload = { accessToken: access_token };
  const code = game.code;
  let options: Partial<TitleTrophiesOptions> = {};
  if (game.platform !== "ps5") {
    options = { ...options, npServiceName: "trophy" };
  }

  type Response = [
    PromiseSettledResult<TitleTrophies>,
    PromiseSettledResult<TitleEarnedTrophies>,
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
    return Response.json(
      { message: "Unable to get trophies" },
      { status: 400 },
    );
  }

  if (titleEarnedTrophies === null) {
    console.error("unable to get earned trophies");
    return Response.json(
      {
        message:
          "Unable to get earned trophies, you probably don't have this game on your account.",
      },
      { status: 400 },
    );
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
    return Response.json(
      { message: "Unable to update game progress", id },
      { status: 400 },
    );
  }

  return Response.json({
    message: "Game progress successfully synced!",
    progress: updateData.progress,
  });
};
