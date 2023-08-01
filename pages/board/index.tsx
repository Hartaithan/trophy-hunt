import BoardContainer from "@/components/BoardContainer";
import { initializeBoard } from "@/helpers/board";
import { type IPage } from "@/models/AppModel";
import { type IGame } from "@/models/GameModel";
import BoardProvider from "@/providers/BoardProvider";
import { type GetServerSideProps } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface IBoardPageProps {
  items: IGame[];
  message?: string;
}

export const getServerSideProps: GetServerSideProps<IBoardPageProps> = async (
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
    if (!response.ok) throw new Error(data);
    return {
      props: { items: data.games ?? [] },
    };
  } catch (error) {
    console.error("unable to fetch games", error);
    return {
      props: { items: [], message: "Unable to fetch games" },
    };
  }
};

const MyBoardPage: IPage<IBoardPageProps> = (props) => {
  const { items } = props;
  const initializedBoard = initializeBoard(items);

  return (
    <BoardProvider initializedBoard={initializedBoard}>
      <BoardContainer />
    </BoardProvider>
  );
};

export default MyBoardPage;
