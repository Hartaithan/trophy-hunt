import { type Params } from "@/models/AppModel";
import { type Game } from "@/models/GameModel";
import { API_URL } from "@/utils/api";
import { initializeBoard } from "@/utils/board";
import { getRefreshedCookies } from "@/utils/cookies";
import { Flex } from "@mantine/core";
import { type NextPage } from "next";

interface BoardParams {
  username: string;
}

const getUsernameBoard = async (username: string): Promise<Game[] | null> => {
  try {
    const cookies = getRefreshedCookies();
    const response = await fetch(`${API_URL}/games?username=${username}`, {
      headers: {
        Cookie: cookies,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data?.games ?? [];
  } catch (error) {
    console.error("unable to fetch games", error);
    return null;
  }
};

const BoardPage: NextPage<Params<BoardParams>> = async ({
  params: { username },
}) => {
  const board = await getUsernameBoard(username);
  const initializedBoard = initializeBoard(board);

  return (
    <Flex h="100%" direction="column" justify="center" align="center">
      <pre style={{ maxWidth: 400, overflow: "auto", fontSize: 8 }}>
        {board == null
          ? "unable to fetch board"
          : JSON.stringify(initializedBoard, null, 2)}
      </pre>
    </Flex>
  );
};

export default BoardPage;
