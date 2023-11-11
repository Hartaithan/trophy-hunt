import BoardContainer from "@/components/BoardContainer/BoardContainer";
import { type Game } from "@/models/GameModel";
import BoardProvider from "@/providers/BoardProvider";
import { API_URL } from "@/utils/api";
import { initializeBoard } from "@/utils/board";
import { getRefreshedCookies } from "@/utils/cookies";
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
  const initializedBoard = initializeBoard(board);

  return (
    <BoardProvider initializedBoard={initializedBoard}>
      <BoardContainer />
    </BoardProvider>
  );
};

export default BoardPage;
