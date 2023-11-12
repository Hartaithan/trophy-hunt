import { type Params } from "@/models/AppModel";
import { type Game } from "@/models/GameModel";
import { type FormattedResponse } from "@/models/TrophyModel";
import { API_URL } from "@/utils/api";
import { getRefreshedCookies } from "@/utils/cookies";
import { Flex } from "@mantine/core";
import { type NextPage } from "next";

interface GameParams {
  id: string;
}

interface GameResponse {
  game: Game | null;
  trophies: FormattedResponse | null;
}

const getGame = async (id: string): Promise<GameResponse | null> => {
  try {
    const cookies = getRefreshedCookies();
    const options: RequestInit = {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: cookies,
      },
    };
    let game: GameResponse["game"] = null;
    let trophies: GameResponse["trophies"] = null;
    const [gameResponse, trophiesResponse] = await Promise.all([
      fetch(`${API_URL}/games/${id}`, options).then(async (res) => {
        const data = await res.json();
        if (res.ok) return data;
        throw new Error(data.message);
      }),
      fetch(`${API_URL}/games/${id}/trophies`, options).then(async (res) => {
        const data = await res.json();
        if (res.ok) return data;
        throw new Error(data.message);
      }),
    ]);
    game = gameResponse.game ?? null;
    trophies = trophiesResponse ?? null;
    return { game, trophies };
  } catch (error) {
    console.error("unable to fetch game", error);
    return null;
  }
};

const GamePage: NextPage<Params<GameParams>> = async ({ params: { id } }) => {
  const response = await getGame(id);
  return (
    <Flex h="100%" p="xl" direction="column" justify="center" align="center">
      {response != null ? (
        <pre
          style={{
            maxWidth: 600,
            maxHeight: 600,
            overflow: "auto",
            fontSize: 8,
          }}>
          {JSON.stringify(response, null, 2)}
        </pre>
      ) : (
        <pre>unable to fetch game</pre>
      )}
    </Flex>
  );
};

export default GamePage;
