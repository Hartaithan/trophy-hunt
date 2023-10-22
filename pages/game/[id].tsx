import GameInfo from "@/components/GameInfo";
import TrophyPanel from "@/components/TrophyPanel";
import TrophyGroups from "@/components/TrophyGroups";
import { type Page } from "@/models/AppModel";
import { type Game } from "@/models/GameModel";
import { type FormattedResponse } from "@/models/TrophyModel";
import GameProvider from "@/providers/GameProvider";
import { Flex, Stack, Text, Title } from "@mantine/core";
import { type GetServerSidePropsContext, type GetServerSideProps } from "next";
import { useRouter } from "next/router";
import CongratulationProvider from "@/providers/CongratulationProvider";
import { IconMoodSadDizzy } from "@tabler/icons-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface GamePageProps {
  game: Game | null;
  trophies: FormattedResponse | null;
  status: "fulfilled" | "rejected";
  message?: string;
}

const fetchOptions = (ctx: GetServerSidePropsContext): RequestInit => ({
  method: "GET",
  credentials: "include",
  headers: {
    Cookie: ctx.req.headers.cookie ?? "",
  },
});

const errorResponse: GamePageProps = {
  game: null,
  trophies: null,
  status: "rejected",
  message: "Something wrong...",
};

export const getServerSideProps: GetServerSideProps<GamePageProps> = async (
  ctx
) => {
  const {
    query: { id },
  } = ctx;
  if (API_URL === undefined) {
    console.error("env variables not found");
    return { props: errorResponse };
  }

  if (id === undefined || Array.isArray(id)) {
    console.error("invalid [id] query", id);
    return { props: errorResponse };
  }

  const options = fetchOptions(ctx);

  try {
    let game: Game | null = null;
    let trophies: FormattedResponse | null = null;
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
    return {
      props: { game, trophies, status: "fulfilled" },
    };
  } catch (error) {
    let message = "Unable to fetch games";
    if (error instanceof Error) {
      message = error.message;
    }
    console.error("unable to fetch games", error);
    return {
      props: { ...errorResponse, message, status: "rejected" },
    };
  }
};

const GamePage: Page<GamePageProps> = (props) => {
  const { game, trophies, status } = props;
  const { query } = useRouter();

  if (status === "rejected")
    return (
      <Flex justify="center" align="center" direction="column">
        <IconMoodSadDizzy size={120} />
        <Title order={3}>Game not exist!</Title>
        <Text c="dimmed">Or you don&apos;t have access to this page</Text>
      </Flex>
    );

  return (
    <CongratulationProvider>
      <GameProvider id={query.id} initialGame={game} initialTrophies={trophies}>
        <Stack spacing="xl" py="xl">
          <GameInfo />
          <TrophyPanel />
          <TrophyGroups />
        </Stack>
      </GameProvider>
    </CongratulationProvider>
  );
};

export default GamePage;
