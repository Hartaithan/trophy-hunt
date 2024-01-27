import {
  type NewGamePayload,
  type AddGameCodePayload,
} from "@/models/GameModel";
import {
  type TitleGroups,
  type TitleTrophiesOptions,
} from "@/models/TrophyModel";
import { validatePayload } from "@/utils/payload";
import { formatPlatform } from "@/utils/platform";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { type AuthorizationPayload, getTitleTrophyGroups } from "psn-api";

export const POST = async (req: Request): Promise<Response> => {
  let body: AddGameCodePayload | null = null;
  try {
    const request: AddGameCodePayload = await req.json();
    body = request;
  } catch (error) {
    console.error("request body not found", error);
    return Response.json(
      { message: "Request body not found" },
      { status: 400 },
    );
  }
  const { code, isFifth = false, status } = body;

  const access_token = cookies().get("psn-access-token")?.value;
  if (typeof access_token !== "string") {
    console.error("psn-access-token not found", access_token);
    return Response.json(
      { message: "Unable to get access token" },
      { status: 400 },
    );
  }

  if (typeof code !== "string") {
    console.error("invalid code type", code);
    return Response.json({ message: "Invalid code type" }, { status: 400 });
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

  const authorization: AuthorizationPayload = { accessToken: access_token };

  const language = profile.language ?? "en-US";
  let listOptions: Partial<TitleTrophiesOptions> = {
    headerOverrides: { "Accept-Language": language },
  };
  if (!isFifth) {
    listOptions = { ...listOptions, npServiceName: "trophy" };
  }

  const titleGroups = (await getTitleTrophyGroups(
    authorization,
    code,
    listOptions,
  )) as TitleGroups;
  if ("error" in titleGroups) {
    let message = "Unable to get trophy groups";
    console.error("unable to get trophy group", titleGroups.error);
    if (titleGroups.error.code === 2240525) {
      message = "Resource not found, please make sure the platform is correct";
    }
    return Response.json({ message }, { status: 400 });
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
