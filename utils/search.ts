import { type SplitSearchResult } from "@/models/GameModel";

export const splitSearchResult = (
  game: string | null = null,
): SplitSearchResult => {
  let result: SplitSearchResult = { id: null, platform: null, hash: null };
  if (game == null) return result;
  const split = game.split("/");
  if (typeof game !== "string" || !game.includes("/")) {
    console.error("invalid game_id", game);
    return result;
  }
  if (split.length > 0 && split.every((i) => i.length > 0)) {
    result = { platform: split[0], id: split[1], hash: split[2] };
  }
  return result;
};
