import { type Params } from "@/models/AppModel";
import {
  type TitleEarnedGroups,
  type TitleEarnedTrophies,
  type TitleGroups,
  type TitleTrophies,
  type TitleTrophiesOptions,
} from "@/models/TrophyModel";
import { createClient } from "@/utils/supabase/server";
import { formatEarnedResponse, mergeGroups, mergeTrophies } from "@/utils/psn";
import { cookies } from "next/headers";
import {
  type AuthorizationPayload,
  getTitleTrophies,
  getTitleTrophyGroups,
  getUserTrophiesEarnedForTitle,
  getUserTrophyGroupEarningsForTitle,
} from "psn-api";

interface TrophyParams {
  id: string;
}

export const GET = async (
  req: Request,
  { params }: Params<TrophyParams>,
): Promise<Response> => {
  const { id } = params;
  const { searchParams } = new URL(req.url);
  const withTrophies = searchParams.get("withTrophies");

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

  const supabase = createClient(cookies());
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError !== null || user === null) {
    console.error("unable to get user", userError);
    return Response.json({ message: "Unable to get user" }, { status: 400 });
  }

  const [profile, game] = await Promise.all([
    supabase.from("profiles").select("language").eq("id", user.id).single(),
    supabase.from("games").select("*, position(*)").eq("id", id).single(),
  ]);
  if (profile.error !== null || profile === null) {
    console.error("unable to get profile", profile.error);
    return Response.json({ message: "Unable to get profile" }, { status: 400 });
  }
  if (game.error !== null) {
    console.error("unable to get game by id", id, game.error);
    return Response.json(
      { message: "Unable to get game by id", id },
      { status: 400 },
    );
  }

  const auth: AuthorizationPayload = { accessToken: access_token };

  const language = profile.data.language ?? "en-US";
  const code = game.data.code;
  let options: Partial<TitleTrophiesOptions> = {
    headerOverrides: { "Accept-Language": language },
  };
  if (game.data.platform !== "ps5") {
    options = { ...options, npServiceName: "trophy" };
  }

  type Response = [
    PromiseSettledResult<TitleGroups>,
    PromiseSettledResult<TitleEarnedGroups>,
    PromiseSettledResult<TitleTrophies>,
    PromiseSettledResult<TitleEarnedTrophies>,
  ];
  let titleGroups: TitleGroups | null = null;
  let titleEarnedGroups: TitleEarnedGroups | null = null;
  let titleTrophies: TitleTrophies | null = null;
  let titleEarnedTrophies: TitleEarnedTrophies | null = null;
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
    return Response.json({ message: defaultMessage }, { status: 400 });
  }

  const mergedGroups = mergeGroups(titleGroups, titleEarnedGroups);
  const mergedTrophies = mergeTrophies(titleTrophies, titleEarnedTrophies);

  const formattedResponse = formatEarnedResponse(
    mergedGroups,
    mergedTrophies,
    withTrophies === "true",
  );

  return Response.json({ ...formattedResponse });
};
