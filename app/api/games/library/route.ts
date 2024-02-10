import {
  type UserTitles,
  type TitleTrophiesOptions,
} from "@/models/TrophyModel";
import { cookies } from "next/headers";
import { type AuthorizationPayload, getUserTitles } from "psn-api";

export const GET = async (req: Request): Promise<Response> => {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");
  const language = searchParams.get("language");

  const access_token = cookies().get("psn-access-token")?.value;
  if (typeof access_token !== "string") {
    console.error("psn-access-token not found");
    return Response.json(
      { message: "Unable to get access token" },
      { status: 400 },
    );
  }

  const auth: AuthorizationPayload = { accessToken: access_token };

  const options: Partial<TitleTrophiesOptions> = {
    headerOverrides: { "Accept-Language": language ?? "en-US" },
    limit: limit != null ? Number(limit) : 10,
    offset: offset != null ? Number(offset) : 0,
  };

  const titlesResponse = (await getUserTitles(
    auth,
    "me",
    options,
  )) as UserTitles;
  if ("error" in titlesResponse) {
    let message = "Unable to get user titles";
    console.error("unable to get user titles", titlesResponse.error);
    if (titlesResponse.error.message != null) {
      message = titlesResponse.error.message;
    }
    return Response.json({ message }, { status: 400 });
  }

  return Response.json(titlesResponse);
};
