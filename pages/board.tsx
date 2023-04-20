import BoardContainer from "@/components/BoardContainer";
import {
  arrayMove,
  initializeBoard,
  moveBetweenContainers,
} from "@/helpers/board";
import { type IPage } from "@/models/AppModel";
import { type IBoardColumns } from "@/models/BoardModel";
import { type IGame } from "@/models/GameModel";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { type GetServerSideProps } from "next";
import { useState } from "react";

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
    }).then(async (res) => await res.json());
    return {
      props: { items: response.games ?? [] },
    };
  } catch (error) {
    console.error("unable to fetch games", error);
    return {
      props: { items: [], message: "Unable to fetch games" },
    };
  }
};

const BoardPage: IPage<IBoardPageProps> = (props) => {
  const { items } = props;
  const initializedBoard = initializeBoard(items);
  const [columns, setColumns] = useState<IBoardColumns>(initializedBoard);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragOver = ({ over, active }: DragOverEvent): void => {
    if (over == null || active.data.current === undefined || over === null) {
      return;
    }

    const activeContainer: keyof IBoardColumns =
      active.data.current.sortable.containerId;
    const overContainer: keyof IBoardColumns =
      over.data.current?.sortable.containerId;

    if (overContainer === undefined) {
      return;
    }

    if (activeContainer !== overContainer) {
      const activeIndex: number = active.data.current.sortable.index;
      const overIndex: number = over.data.current?.sortable.index ?? 0;
      setColumns((items) => {
        const movedItems = moveBetweenContainers(
          items,
          activeContainer,
          activeIndex,
          overContainer,
          overIndex,
          active.id
        );
        return movedItems;
      });
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent): void => {
    if (over == null || active.data.current === undefined || over === null) {
      return;
    }

    if (active.id !== over.id) {
      const activeContainer: keyof IBoardColumns =
        active.data.current.sortable.containerId;
      const overContainer: keyof IBoardColumns =
        over.data.current?.sortable.containerId ?? over.id;
      const activeIndex: number = active.data.current.sortable.index;
      const overIndex: number = over.data.current?.sortable.index ?? 0;

      setColumns((items) => {
        let newItems: IBoardColumns = { ...items };
        if (activeContainer === overContainer) {
          newItems = {
            ...items,
            [overContainer]: arrayMove(
              items[overContainer],
              activeIndex,
              overIndex
            ),
          };
        } else {
          newItems = moveBetweenContainers(
            items,
            activeContainer,
            activeIndex,
            overContainer,
            overIndex,
            active.id
          );
        }
        return newItems;
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      collisionDetection={closestCorners}
    >
      <BoardContainer columns={columns} />
    </DndContext>
  );
};

export default BoardPage;
