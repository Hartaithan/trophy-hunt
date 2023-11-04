import {
  type SearchResponse,
  type SearchItem,
  type SearchResult,
} from "@/models/SearchModel";
import { search as headers } from "@/utils/headers";

const SEARCH_URL = process.env.NEXT_PUBLIC_SEARCH_URL;

const allowedPlatforms: string[] = ["PS5", "PS4", "PS3", "Vita"];

export const GET = async (req: Request): Promise<Response> => {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (SEARCH_URL === undefined) {
    console.error("SEARCH_URL not found", SEARCH_URL);
    return Response.json({ message: "Internal server error" }, { status: 400 });
  }
  if (query == null || query.length === 0) {
    console.error("query is required", query);
    return Response.json({ message: "Query is required" }, { status: 400 });
  }

  let results = null;
  const errorMessage = `Unable to search by query: ${query}`;
  try {
    const response = await fetch(`${SEARCH_URL}/games/search?search=${query}`, {
      headers,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(errorMessage);
    results = data;
  } catch (error) {
    console.error("search error", error);
    return Response.json({ message: errorMessage }, { status: 400 });
  }

  const games: SearchItem[] = results?.games ?? [];
  const formattedGames: SearchResult[] = [];
  for (let i = 0; i < games.length; i++) {
    const { id, title, platform_title, count_tlist } = games[i];
    if (allowedPlatforms.includes(platform_title) && count_tlist > 0) {
      formattedGames.push({
        id: formattedGames.length + 1,
        name: title,
        platform: platform_title,
        url: `${platform_title.toLowerCase()}/${id}`,
      });
    }
  }

  const response: SearchResponse = { query, results: formattedGames };
  return Response.json(response);
};
