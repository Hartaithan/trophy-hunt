import {
  type ISearchResponse,
  type ISearchQueries,
  type ISearchResult,
  type ISearchItem,
} from "@/models/SearchModel";
import { type NextApiHandler } from "next";

const SEARCH_URL = process.env.NEXT_PUBLIC_SEARCH_URL;

const allowedPlatforms: string[] = ["PS5", "PS4", "PS3", "Vita"];

const searchByQuery: NextApiHandler = async (req, res) => {
  const { query } = req.query as ISearchQueries;
  if (SEARCH_URL === undefined) {
    return res.status(400).json({ message: "SEARCH_URL not found" });
  }
  if (query === undefined || query.length === 0) {
    return res.status(400).json({ message: "Query is required" });
  }
  let results = null;
  try {
    results = await fetch(`${SEARCH_URL}/games/search?search=${query}`).then(
      async (r) => await r.json()
    );
  } catch (error) {
    console.error("search error", error);
    return res
      .status(400)
      .json({ message: `Unable to search by query: ${query}` });
  }
  const games: ISearchItem[] = results !== null ? results.games : [];
  const formattedGames: ISearchResult[] = [];
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
  const response: ISearchResponse = { query, results: formattedGames };
  return res.status(200).json(response);
};

const handler: NextApiHandler = async (req, res) => {
  const { method = "[Not Found]" } = req;
  switch (method) {
    case "GET":
      return searchByQuery(req, res);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
