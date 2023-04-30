import { Flex, useMantineTheme } from "@mantine/core";
import { type FC } from "react";
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

const BoardContainer: FC = () => {
  const { spacing } = useMantineTheme();
  const { columns, setColumns } = useBoard();

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragOver = ({ over, active }: DragOverEvent): void => {
    if (over == null || active.data.current === undefined || over === null) {
      return;
    }

    const activeContainer: keyof IBoardColumns =
      active.data.current.sortable.containerId;
    const overContainer: keyof IBoardColumns =
      over.data.current?.sortable.containerId ?? over.id;
    const activeIndex: number = active.data.current.sortable.index;
    const overIndex: number = over.data.current?.sortable.index ?? 0;

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
