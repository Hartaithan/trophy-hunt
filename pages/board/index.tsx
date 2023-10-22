import BoardContainer from "@/components/BoardContainer";
import { initializeBoard } from "@/helpers/board";
import { type Page } from "@/models/AppModel";
import { type Game } from "@/models/GameModel";
import BoardProvider from "@/providers/BoardProvider";
import { type GetServerSideProps } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface BoardPageProps {
  items: Game[];
  message?: string;
}

export const getServerSideProps: GetServerSideProps<BoardPageProps> = async (
  ctx
) => {
  if (API_URL === undefined) {
    console.error("env variables not found");
    return { props: { items: [], message: "Something wrong..." } };
  }

  try {
    const response = await fetch(`${API_URL}/games`, {
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

const MyBoardPage: Page<BoardPageProps> = (props) => {
  const { items } = props;
  const initializedBoard = initializeBoard(items);

  return (
    <BoardProvider initializedBoard={initializedBoard}>
      <BoardContainer />
    </BoardProvider>
  );
};

export default MyBoardPage;
