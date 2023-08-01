import { type IPage } from "@/models/AppModel";
import { type IGame } from "@/models/GameModel";
import { Flex, Text, Title } from "@mantine/core";
import { type GetServerSideProps } from "next";
import { useRouter } from "next/router";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface IBoardPageProps {
  items: IGame[];
  message?: string;
}

export const getServerSideProps: GetServerSideProps<IBoardPageProps> = async (
  ctx
) => {
  const {
    query: { username },
  } = ctx;

  if (API_URL === undefined) {
    console.error("env variables not found");
    return { props: { items: [], message: "Something wrong..." } };
  }

  if (
    username == null ||
    Array.isArray(username) ||
    username.trim().length === 0
  ) {
    console.error("invalid [username] query", username);
    return {
      props: { items: [], message: "Invalid username query" },
    };
  }

  try {
    const response = await fetch(`${API_URL}/games?username=${username}`, {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: ctx.req.headers.cookie ?? "",
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return {
      props: { items: data.games ?? [] },
    };
  } catch (error) {
    let message = "Unable to fetch games";
    if (error instanceof Error) {
      message = error.message;
    }
    console.error("unable to fetch games", error);
    return {
      props: { items: [], message },
    };
  }
};

const BoardPage: IPage<IBoardPageProps> = (props) => {
  const { query } = useRouter();
  return (
    <Flex direction="column" py="xl">
      <Title order={3} mb="md">
        Board Page
      </Title>
      <Text mb="md">username: {query.username}</Text>
      <Text component="pre" size="xs">
        props: {JSON.stringify(props, null, 2)}
      </Text>
    </Flex>
  );
};

export default BoardPage;
