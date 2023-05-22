import GameInfo from "@/components/GameInfo";
import TrophyList from "@/components/TrophyList";
import { type IPage } from "@/models/AppModel";
import { type IGame } from "@/models/GameModel";
import { type IFormattedResponse } from "@/models/TrophyModel";
import { Flex } from "@mantine/core";
import { type GetServerSidePropsContext, type GetServerSideProps } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface IGamePageProps {
  game: IGame | null;
  trophies: IFormattedResponse | null;
  message?: string;
}

const fetchOptions = (ctx: GetServerSidePropsContext): RequestInit => ({
  method: "GET",
  credentials: "include",
  headers: {
    Cookie: ctx.req.headers.cookie ?? "",
  },
});

const errorResponse: IGamePageProps = {
  game: null,
  trophies: null,
  message: "Something wrong...",
};

export const getServerSideProps: GetServerSideProps<IGamePageProps> = async (
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
    let game: IGame | null = null;
    let trophies: IFormattedResponse | null = null;
    const [gameResponse, trophiesResponse] = await Promise.allSettled([
      fetch(`${API_URL}/games/${id}`, options).then(
        async (res) => await res.json()
      ),
      fetch(`${API_URL}/games/${id}/trophies`, options).then(
        async (res) => await res.json()
      ),
    ]);
    if (gameResponse.status === "fulfilled") {
      game = gameResponse.value.game ?? null;
    }
    if (trophiesResponse.status === "fulfilled") {
      trophies = trophiesResponse.value;
    }
    return {
      props: { game, trophies },
    };
  } catch (error) {
    console.error("unable to fetch games", error);
    return {
      props: { ...errorResponse, message: "Unable to fetch games" },
    };
  }
};

const GamePage: IPage<IGamePageProps> = (props) => {
  const { game, trophies } = props;

  return (
    <Flex
      w="100%"
      h="100%"
      direction="column"
      justify="center"
      align="center"
      py="md"
    >
      <GameInfo game={game} />
      <TrophyList trophies={trophies} />
    </Flex>
  );
};

export default GamePage;
