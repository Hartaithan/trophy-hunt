import { type Game } from "@/models/GameModel";
import { API_URL } from "@/utils/api";
import { getRefreshedCookies } from "@/utils/cookies";
import { Flex, Title } from "@mantine/core";
import { type NextPage } from "next";

const getBoard = async (): Promise<Game[]> => {
  try {
    const cookies = getRefreshedCookies();
    const response = await fetch(`${API_URL}/games`, {
      headers: {
        Cookie: cookies,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data?.games ?? [];
  } catch (error) {
    console.error("unable to fetch games", error);
    return [];
  }
};

const BoardPage: NextPage = async () => {
  const board = await getBoard();
  return (
    <Flex h="100%" direction="column" justify="center" align="center">
      <Title>BoardPage</Title>
      {board.length > 0 ? (
        <pre
          style={{
            maxWidth: 600,
            maxHeight: 400,
            overflow: "auto",
            fontSize: 8,
          }}>
          {JSON.stringify(board, null, 2)}
        </pre>
      ) : (
        <pre>empty</pre>
      )}
    </Flex>
  );
};

export default BoardPage;
