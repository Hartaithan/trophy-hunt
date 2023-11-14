import GameInfo from "@/components/GameInfo/GameInfo";
import TrophyGroups from "@/components/TrophyGroups/TrophyGroups";
import TrophyPanel from "@/components/TrophyPanel/TrophyPanel";
import { type Params } from "@/models/AppModel";
import { type Game } from "@/models/GameModel";
import { type FormattedResponse } from "@/models/TrophyModel";
import CongratulationProvider from "@/providers/CongratulationProvider";
import GameProvider from "@/providers/GameProvider";
import { API_URL } from "@/utils/api";
import { getRefreshedCookies } from "@/utils/cookies";
import { Stack, Text, Flex, Title } from "@mantine/core";
import { IconMoodSadDizzy } from "@tabler/icons-react";
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

  if (response == null)
    return (
      <Flex justify="center" align="center" direction="column">
        <IconMoodSadDizzy size={120} />
        <Title order={3}>Game not exist!</Title>
        <Text c="dimmed">Or you don&apos;t have access to this page</Text>
      </Flex>
    );

  return (
    <CongratulationProvider>
      <GameProvider
        id={id}
        initialGame={response.game}
        initialTrophies={response.trophies}>
        <Stack gap="xl" py="xl">
          <GameInfo />
          <TrophyPanel />
          <TrophyGroups />
        </Stack>
      </GameProvider>
    </CongratulationProvider>
  );
};

export default GamePage;
