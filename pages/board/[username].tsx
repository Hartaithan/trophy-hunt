import BoardColumn from "@/components/BoardColumn";
import { initializeBoard } from "@/helpers/board";
import { type Page } from "@/models/AppModel";
import { type BOARD_COLUMNS } from "@/models/BoardModel";
import { type Game } from "@/models/GameModel";
import { Flex, Text, Title, createStyles } from "@mantine/core";
import { IconMoodSadDizzy } from "@tabler/icons-react";
import { type GetServerSideProps } from "next";
import { useRouter } from "next/router";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface BoardPageProps {
  items: Game[];
  message?: string;
  status: "fulfilled" | "rejected";
}

export const getServerSideProps: GetServerSideProps<BoardPageProps> = async (
  ctx
) => {
  const {
    query: { username },
  } = ctx;

  if (API_URL === undefined) {
    console.error("env variables not found");
    return {
      props: { items: [], message: "Something wrong...", status: "rejected" },
    };
  }

  if (
    username == null ||
    Array.isArray(username) ||
    username.trim().length === 0
  ) {
    console.error("invalid [username] query", username);
    return {
      props: {
        items: [],
        message: "Invalid username query",
        status: "rejected",
      },
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
      props: { items: data.games ?? [], status: "fulfilled" },
    };
  } catch (error) {
    let message = "Unable to fetch games";
    if (error instanceof Error) {
      message = error.message;
    }
    console.error("unable to fetch games", error);
    return {
      props: { items: [], message, status: "rejected" },
    };
  }
};

const useStyles = createStyles(() => ({
  container: {
    flex: 1,
  },
  private: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const BoardPage: Page<BoardPageProps> = (props) => {
  const { items, status } = props;
  const { classes } = useStyles();
  const { query } = useRouter();
  const initializedBoard = initializeBoard(items);

  return (
    <Flex direction="column" pt="md" pb="xl">
      <Title order={3} mb="sm" tt="capitalize">
        {query.username}&apos;s board
      </Title>
      {status === "fulfilled" ? (
        <Flex className={classes.container} gap="xl">
          {Object.keys(initializedBoard).map((col) => {
            const key = col as BOARD_COLUMNS;
            const items = initializedBoard[key];
            return (
              <BoardColumn
                key={col}
                column={key}
                items={items}
                interactive={false}
              />
            );
          })}
        </Flex>
      ) : (
        <Flex className={classes.private}>
          <IconMoodSadDizzy size={120} />
          <Title order={3}>Board not exist!</Title>
          <Text c="dimmed">
            Or the user is restricted from accessing their board.
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

export default BoardPage;
