"use client";

import { Flex } from "@mantine/core";
import { useRef, type FC } from "react";
import { type BoardColumns, type BOARD_COLUMNS } from "@/models/BoardModel";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  closestCorners,
  useSensor,
  useSensors,
  MeasuringStrategy,
  type PointerActivationConstraint,
  type DragStartEvent,
  DragOverlay,
  PointerSensor,
  TouchSensor,
} from "@dnd-kit/core";
import { useBoard } from "@/providers/BoardProvider";
import { type ReorderItem, type ReorderPayload } from "@/models/GameModel";
import API from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { IconAlertOctagon, IconCheck } from "@tabler/icons-react";
import classes from "./BoardContainer.module.css";
import BoardColumn from "../BoardColumn/BoardColumn";
import BoardCard from "../BoardCard/BoardCard";
import { arrayMove } from "@dnd-kit/sortable";
import { moveBetweenContainers } from "@/utils/dnd";
import { useMediaQuery } from "@mantine/hooks";
import { type Device } from "@/models/AppModel";

interface Move {
  start: string | null;
  end: string | null;
}

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

const constraints: Record<Device, PointerActivationConstraint> = {
  desktop: {
    distance: 15,
  },
  mobile: {
    distance: 15,
    tolerance: 5,
    delay: 200,
  },
};

const BoardContainer: FC = () => {
  const { columns, setColumns, active, setActive } = useBoard();
  const move = useRef<Move>({ start: null, end: null });
  const columnsRef = useRef<BoardColumns>(columns);
  const previousRef = useRef<BoardColumns>(columns);
  const lastActiveContainer = useRef<BOARD_COLUMNS | null>(null);
  const lastActiveIndex = useRef<number>(0);
  const lastOverContainer = useRef<BOARD_COLUMNS | null>(null);
  const lastOverIndex = useRef<number>(0);
  const isMobile = useMediaQuery(`(max-width: 62em)`) ?? false;
  const device: Device = isMobile ? "mobile" : "desktop";
  const sensor = isMobile ? TouchSensor : PointerSensor;

  const sensors = useSensors(
    useSensor(sensor, {
      activationConstraint: constraints[device],
    }),
  );

  const handleMoveEnd = (): void => {
    let payload: ReorderPayload | null = null;
    const { start, end } = move.current;
    if (start === null || end === null) return;
    if (start === end) {
      const items: ReorderItem[] = columnsRef.current[start].map(
        (i, index) => ({
          id: i.id,
          value: index,
          status: i.status,
        }),
      );
      payload = { items };
    } else {
      const startItems: ReorderItem[] = columnsRef.current[start].map(
        (i, index) => ({
          id: i.id,
          value: index,
          status: i.status,
        }),
      );
      const endItems: ReorderItem[] = columnsRef.current[end].map(
        (i, index) => ({
          id: i.id,
          value: index,
          status: i.status,
        }),
      );
      payload = { items: [...startItems, ...endItems] };
    }
    if (payload === null) return;
    notifications.show({
      id: "reorder",
      loading: true,
      title: "Sync...",
      message:
        "Synchronizing the order of games... It shouldn't take long, don't reload the page.",
      autoClose: false,
      withCloseButton: false,
    });
    API.post("/games/reorder", JSON.stringify(payload))
      .then((res) => {
        notifications.update({
          id: "reorder",
          loading: false,
          title: "Success!",
          message: res.data.message,
          icon: <IconCheck size="1rem" />,
          autoClose: 3000,
        });
      })
      .catch((error) => {
        setColumns(previousRef.current);
        notifications.update({
          id: "reorder",
          loading: false,
          color: "red",
          title: "Something went wrong!",
          message:
            "For some reason the synchronization did not complete, please try again.",
          icon: <IconAlertOctagon size="1rem" />,
          withCloseButton: true,
        });
        console.error("reorder columns error", error);
      });
    move.current = { start: null, end: null };
  };

  const handleDragStart = ({ active }: DragStartEvent): void => {
    if (active.data.current === undefined) return;

    const activeContainer: BOARD_COLUMNS =
      active.data.current.sortable.containerId;
    const activeIndex: number = active.data.current.sortable.index;
    lastActiveContainer.current = activeContainer;
    lastActiveIndex.current = activeIndex;

    const item = columns[activeContainer].find((item) => item.id === active.id);
    if (item === undefined) return;

    setActive(item);
  };

  const handleDragOver = ({ active, over }: DragOverEvent): void => {
    if (over == null || active.data.current == null) return;

    const activeContainer: BOARD_COLUMNS | undefined =
      active.data.current?.sortable?.containerId;
    const activeIndex: number | undefined =
      active.data.current?.sortable?.index;
    const overContainer: BOARD_COLUMNS | undefined =
      over.data.current?.sortable?.containerId ?? over.id;
    const overIndex: number | undefined =
      over.data.current?.sortable?.index ?? 0;

    if (activeContainer != null) lastActiveContainer.current = activeContainer;
    if (activeIndex != null) lastActiveIndex.current = activeIndex;
    if (overContainer != null) lastOverContainer.current = overContainer;
    if (overIndex != null) lastOverIndex.current = overIndex;

    if (
      activeContainer == null ||
      activeIndex == null ||
      overContainer == null ||
      overIndex == null
    ) {
      return;
    }

    if (move.current.start === null) {
      move.current.start = activeContainer;
    }

    if (activeContainer !== overContainer) {
      setColumns((items) => {
        previousRef.current = items;
        const movedItems = moveBetweenContainers(
          items,
          activeContainer,
          activeIndex,
          overContainer,
          overIndex,
          active.id,
        );
        columnsRef.current = movedItems;
        return movedItems;
      });
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent): void => {
    if (over == null || active.data.current == null) return;

    const activeContainer: BOARD_COLUMNS =
      active.data.current?.sortable?.containerId ?? lastActiveContainer.current;
    const activeIndex: number =
      active.data.current?.sortable?.index ?? lastActiveIndex.current;
    const overContainer: BOARD_COLUMNS =
      over.data.current?.sortable?.containerId ?? lastOverContainer.current;
    const overIndex: number =
      over.data.current?.sortable?.index ?? lastOverIndex.current;

    if (active.id !== over.id) {
      setColumns((items) => {
        let newItems: BoardColumns = { ...items };
        if (activeContainer === overContainer) {
          const movedItems = arrayMove(
            items[overContainer],
            activeIndex,
            overIndex,
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
            active.id,
          );
          newItems = movedBetweenContainers;
        }
        columnsRef.current = newItems;
        return newItems;
      });
    }

    setActive(null);
    move.current.end = overContainer;
    lastActiveContainer.current = null;
    lastActiveIndex.current = 0;
    lastOverContainer.current = null;
    lastOverIndex.current = 0;
    handleMoveEnd();
  };

  return (
    <DndContext
      sensors={sensors}
      measuring={measuring}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      collisionDetection={closestCorners}>
      <Flex className={classes.container}>
        {Object.keys(columns).map((col) => {
          const key = col as BOARD_COLUMNS;
          const items = columns[key];
          return <BoardColumn key={col} column={key} items={items} />;
        })}
      </Flex>
      <DragOverlay>
        {active != null && <BoardCard item={active} overlay />}
      </DragOverlay>
    </DndContext>
  );
};

export default BoardContainer;
