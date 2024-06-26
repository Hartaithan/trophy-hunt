"use client";

import {
  type AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
  useSortable,
} from "@dnd-kit/sortable";
import { Flex, type FlexProps, Text, useMantineTheme } from "@mantine/core";
import { memo, type FC, type CSSProperties } from "react";
import { CSS } from "@dnd-kit/utilities";
import { type Game } from "@/models/GameModel";
import ProgressStats from "../ProgressStats/ProgressStats";
import ColumnBadge from "../ColumnBadge/ColumnBadge";
import PlatformBadge from "../PlatformBadge/PlatformBadge";
import BoardCardMenu from "../BoardCardMenu/BoardCardMenu";
import clsx from "clsx";
import classes from "./BoardCard.module.css";
import { useMediaQuery } from "@mantine/hooks";
import GameThumbnail from "../GameThumbnail/GameThumbnail";

interface BoardCardProps extends FlexProps {
  item: Game;
  className?: string;
  interactive?: boolean;
  divider?: boolean;
  overlay?: boolean;
  style?: CSSProperties;
  offset?: number;
}

const animateLayoutChanges: AnimateLayoutChanges = (args) => {
  const { isSorting, wasDragging } = args;
  if (isSorting || wasDragging) return defaultAnimateLayoutChanges(args);
  return true;
};

const BoardCard: FC<BoardCardProps> = (props) => {
  const {
    item,
    className = "",
    interactive = true,
    overlay = false,
    divider = false,
    style,
    offset,
    ...rest
  } = props;
  const { id, title, image_url, status, platform, progress } = item;

  const { spacing } = useMantineTheme();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, animateLayoutChanges, disabled: !interactive });
  const isMobile = useMediaQuery(`(max-width: 62em)`) ?? false;

  return (
    <Flex
      component={interactive ? "a" : "div"}
      href={`/game/${id}`}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      aria-describedby=""
      suppressHydrationWarning
      className={clsx([
        className,
        classes.container,
        isDragging && classes.draggable,
      ])}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 99999 : undefined,
        visibility: isDragging && !overlay ? "hidden" : "unset",
        cursor: interactive ? "pointer" : "default",
        marginBottom: isMobile ? 0 : divider ? spacing.sm : 0,
        ...style,
        left: offset,
      }}
      {...rest}>
      <Flex className={classes.header}>
        <ColumnBadge status={status} />
        <PlatformBadge platform={platform} />
        {interactive && <BoardCardMenu item={item} />}
      </Flex>
      <GameThumbnail url={image_url} overlay={platform === "ps5"} />
      <Text className={classes.title} lineClamp={isMobile ? 1 : 2}>
        {title}
      </Text>
      <ProgressStats className={classes.disabled} progress={progress} />
    </Flex>
  );
};

export default memo(BoardCard);
