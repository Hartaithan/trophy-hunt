import { Flex, useMantineTheme } from "@mantine/core";
import { useRef, type FC } from "react";
import BoardColumn from "./BoardColumn";
import { type IBoardColumns, type BOARD_COLUMNS } from "@/models/BoardModel";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, moveBetweenContainers } from "@/helpers/board";
import { useBoard } from "@/providers/BoardProvider";
import { type IReorderItem, type IReorderPayload } from "@/models/GameModel";
import API from "@/helpers/api";

interface IMove {
  start: string | null;
  end: string | null;
}

const BoardContainer: FC = () => {
  const { spacing } = useMantineTheme();
  const { columns, setColumns } = useBoard();
  const move = useRef<IMove>({ start: null, end: null });
  const columnsRef = useRef<IBoardColumns>(columns);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleMoveEnd = (): void => {
    let payload: IReorderPayload | null = null;
    const { start, end } = move.current;
    if (start === null || end === null) return;
    if (start === end) {
      const items: IReorderItem[] = columnsRef.current[start].map(
        (i, index) => ({
          id: i.id,
          order_index: index,
          status: i.status,
        })
      );
      payload = { items };
    } else {
      const startItems: IReorderItem[] = columnsRef.current[start].map(
        (i, index) => ({
          id: i.id,
          order_index: index,
          status: i.status,
        })
      );
      const endItems: IReorderItem[] = columnsRef.current[end].map(
        (i, index) => ({
          id: i.id,
          order_index: index,
          status: i.status,
        })
      );
      payload = { items: [...startItems, ...endItems] };
    }
    if (payload === null) return;
    API.post("/games/reorder", JSON.stringify(payload))
      .then((res) => {
        // TODO: show notification with res.message
      })
      .catch((error) => {
        // TODO: show notification with errors
        console.error("reorder columns error", error);
      });
    move.current = { start: null, end: null };
  };

  const handleDragOver = ({ over, active }: DragOverEvent): void => {
    if (over == null || active.data.current === undefined || over === null) {
      return;
    }

    const activeContainer: BOARD_COLUMNS =
      active.data.current.sortable.containerId;
    const overContainer: BOARD_COLUMNS =
      over.data.current?.sortable.containerId ?? over.id;
    const activeIndex: number = active.data.current.sortable.index;
    const overIndex: number = over.data.current?.sortable.index ?? 0;

    if (move.current.start === null) {
      move.current.start = activeContainer;
    }

    if (activeContainer !== overContainer) {
      setColumns((items) => {
        const movedItems = moveBetweenContainers(
          items,
          activeContainer,
          activeIndex,
          overContainer,
          overIndex,
          active.id
        );
        columnsRef.current = movedItems;
        return movedItems;
      });
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent): void => {
    if (over == null || active.data.current === undefined || over === null) {
      return;
    }

    const activeContainer: BOARD_COLUMNS =
      active.data.current.sortable.containerId;
    const overContainer: BOARD_COLUMNS =
      over.data.current?.sortable.containerId ?? over.id;
    const activeIndex: number = active.data.current.sortable.index;
    const overIndex: number = over.data.current?.sortable.index ?? 0;

    if (active.id !== over.id) {
      setColumns((items) => {
        let newItems: IBoardColumns = { ...items };
        if (activeContainer === overContainer) {
          const movedItems = arrayMove(
            items[overContainer],
            activeIndex,
            overIndex
          );
          const movedInsideContainer = {
            ...items,
            [overContainer]: movedItems,
          };
          newItems = movedInsideContainer;
        } else {
          const movedBetweenContainers = moveBetweenContainers(
            items,
            activeContainer,
            activeIndex,
            overContainer,
            overIndex,
            active.id
          );
          newItems = movedBetweenContainers;
        }
        columnsRef.current = newItems;
        return newItems;
      });
    }

    move.current.end = overContainer;
    handleMoveEnd();
  };

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      collisionDetection={closestCorners}
    >
      <Flex gap={spacing.xl} py={spacing.xl}>
        {Object.keys(columns).map((col) => {
          const key = col as BOARD_COLUMNS;
          const items = columns[key];
          return <BoardColumn key={col} column={key} items={items} />;
        })}
      </Flex>
    </DndContext>
  );
};

export default BoardContainer;
