import { validatePayload } from "@/helpers/payload";
import { type IAddGamePayload } from "@/models/GameModel";
import { type NextApiHandler } from "next";

const SEARCH_URL = process.env.NEXT_PUBLIC_SEARCH_URL;

interface ISplittedId {
  id: string | null;
  platform: string | null;
}

const splitId = (game: string): ISplittedId => {
  let platform: ISplittedId = { id: null, platform: null };
  const splitted = game.split("/");
  if (typeof game !== "string" || !game.includes("/")) {
    return platform;
  }
  if (splitted.length > 0 && splitted.every((i) => i.length > 0)) {
    platform = { platform: splitted[0], id: splitted[1] };
  }
  return platform;
};

const getGame = async (id: string): Promise<string | null> => {
  let game: { id: string } | null = null;
  let content: string | null = null;

  if (SEARCH_URL === undefined) {
    console.error("SEARCH_URL not found");
    return content;
  }

  try {
    const fetchUrl = `${SEARCH_URL}/trophies_list/games/${id}`;
    game = await fetch(fetchUrl).then(async (r) => await r.json());
  } catch (error) {
    console.error("get game content error", error);
  }

  if (game == null) return content;

  try {
    const fetchUrl = `${SEARCH_URL}/trophies/trophies_list/${game.id}`;
    const response = await fetch(fetchUrl).then(async (r) => await r.json());
    content = response.length > 0 ? response[0].image : null;
  } catch (error) {
    console.error("get game list error", error);
  }

  return content;
};

const getCode = (value: string | null): string | null => {
  const searchTag = "NPWR";
  if (value === null) {
    return null;
  }
  const code = value.substr(value.indexOf(searchTag), 8 + searchTag.length);
  if (code.length !== 12) {
    return null;
  }
  return code;
};

const addGame: NextApiHandler = async (req, res) => {
  const { gameId, lang = "en-en" } = req.body as IAddGamePayload;

  if (typeof gameId !== "string") {
    return res.status(400).json({ message: "Invalid gameId type" });
  }

  const results = validatePayload(req.body);
  if (results !== null) {
    return res.status(400).json(results);
  }

  const { id, platform } = splitId(gameId);
  if (id === null || platform === null) {
    return res.status(400).json({ message: "Unable to get id or platform" });
  }

  const game = await getGame(id);
  const code = getCode(game);
  if (game === null || game.length === 0 || code === null) {
    return res.status(400).json({ message: "Unable to find game code" });
  }

  return res.status(200).json({ message: "Hello world!", lang, code });
};

const handler: NextApiHandler = async (req, res) => {
  const { method = "[Not Found]" } = req;
  switch (method) {
    case "POST":
      return addGame(req, res);
    default:
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
