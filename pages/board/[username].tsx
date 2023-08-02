import BoardColumn from "@/components/BoardColumn";
import { initializeBoard } from "@/helpers/board";
import { type IPage } from "@/models/AppModel";
import { type BOARD_COLUMNS } from "@/models/BoardModel";
import { type IGame } from "@/models/GameModel";
import { Flex, Title, createStyles } from "@mantine/core";
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

const useStyles = createStyles(() => ({
  container: {
    flex: 1,
  },
}));

const BoardPage: IPage<IBoardPageProps> = (props) => {
  const { items } = props;
  const { classes } = useStyles();
  const { query } = useRouter();
  const initializedBoard = initializeBoard(items);

  return (
    <Flex direction="column" pt="md" pb="xl">
      <Title order={3} mb="sm" tt="capitalize">
        {query.username}&apos;s board
      </Title>
      <Flex className={classes.container} gap="xl">
        {Object.keys(initializedBoard).map((col) => {
          const key = col as BOARD_COLUMNS;
          const items = initializedBoard[key];
          return <BoardColumn key={col} column={key} items={items} />;
        })}
      </Flex>
    </Flex>
  );
};

export default BoardPage;
