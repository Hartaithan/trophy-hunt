import { type SplitSearchResult } from "@/models/GameModel";

export const splitSearchResult = (game: string): SplitSearchResult => {
  let platform: SplitSearchResult = { id: null, platform: null, hash: null };
  const split = game.split("/");
  if (typeof game !== "string" || !game.includes("/")) {
    console.error("invalid game_id", game);
    return platform;
  }
  if (split.length > 0 && split.every((i) => i.length > 0)) {
    platform = { platform: split[0], id: split[1], hash: split[2] };
  }
  return platform;
};
