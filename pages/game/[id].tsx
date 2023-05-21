import TrophyList from "@/components/TrophyList";
import { type IPage } from "@/models/AppModel";
import { type IGame } from "@/models/GameModel";
import { type IFormattedResponse } from "@/models/TrophyModel";
import { Text, Flex, Title } from "@mantine/core";
import { type GetServerSidePropsContext, type GetServerSideProps } from "next";
import { useRouter } from "next/router";

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
      game = gameResponse.value;
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
  const { query } = useRouter();

  return (
    <Flex
      w="100%"
      h="100%"
      direction="column"
      justify="center"
      align="center"
      py="md"
    >
      <Title order={2}>GamePage</Title>
      <Text>query: {JSON.stringify(query, null, 2)}</Text>
      <Text component="pre" size={9} mb="xl">
        game: {JSON.stringify(game, null, 2)}
      </Text>
      <TrophyList trophies={trophies} />
    </Flex>
  );
};

export default GamePage;
