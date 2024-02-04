import {
  type RegionsResult,
  type RegionsResponse,
  type RegionItem,
} from "@/models/RegionModel";
import { SEARCH_URL } from "@/constants/api";
import { search as headers } from "@/utils/headers";
import { regionLabels } from "@/constants/locales";

const allowedPlatforms: string[] = ["PS5", "PS4", "PS3", "Vita"];

export const GET = async (req: Request): Promise<Response> => {
  const { searchParams } = new URL(req.url);
  const hash = searchParams.get("hash");

  if (SEARCH_URL === undefined) {
    console.error("SEARCH_URL not found", SEARCH_URL);
    return Response.json({ message: "Internal server error" }, { status: 400 });
  }
  if (hash == null || hash.length === 0) {
    console.error("hash is required", hash);
    return Response.json({ message: "Hash is required" }, { status: 400 });
  }

  let results = null;
  const errorMessage = "Unable to get regions";
  try {
    const response = await fetch(
      `${SEARCH_URL}/trophies_list/games_hash/${hash}`,
      {
        headers,
      },
    );
    const data = await response.json();
    if (!response.ok) throw new Error(errorMessage);
    results = data;
  } catch (error) {
    console.error("get Regions error", error);
    return Response.json({ message: errorMessage }, { status: 400 });
  }

  const games: RegionItem[] = results ?? [];
  const formattedGames: RegionsResult[] = [];
  for (let i = 0; i < games.length; i++) {
    const { id, title, platform_title } = games[i];
    if (allowedPlatforms.includes(platform_title)) {
      formattedGames.push({
        id,
        title: regionLabels[title] ?? title,
        platform: platform_title,
      });
    }
  }

  const response: RegionsResponse = { results: formattedGames };
  return Response.json(response);
};
