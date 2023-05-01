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
    const { start, end } = move.current;
    if (start === null || end === null) return;
    if (start === end) {
      console.info("move inside container");
      console.info("start items", columnsRef.current[start]);
    } else {
      console.info("move between container");
      console.info("start items", columnsRef.current[start]);
      console.info("end items", columnsRef.current[end]);
    }
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
