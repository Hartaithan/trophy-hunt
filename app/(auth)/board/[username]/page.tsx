import BoardPreview from "@/components/BoardPreview/BoardPreview";
import { type Page } from "@/models/AppModel";
import { type Game } from "@/models/GameModel";
import { API_URL } from "@/constants/api";
import { initializeBoard } from "@/utils/board";
import { getRefreshedCookies } from "@/utils/cookies";
import { Flex, Title } from "@mantine/core";

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

const BoardPage: Page<BoardParams> = async ({
  params: { username = "[Not Found]" },
}) => {
  const board = await getUsernameBoard(username);
  const initializedBoard = initializeBoard(board);

  return (
    <Flex direction="column" h="100%" pt="md" pb="xl">
      <Title order={3} mb="sm" tt="capitalize">
        {username}&apos;s board
      </Title>
      <BoardPreview isReady={board != null} board={initializedBoard} />
    </Flex>
  );
};

export default BoardPage;
