"use client";

import {
  type AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
  useSortable,
} from "@dnd-kit/sortable";
import { Box, Flex, Overlay, Text, useMantineTheme } from "@mantine/core";
import { memo, type FC, type MouseEventHandler } from "react";
import { CSS } from "@dnd-kit/utilities";
import { type Game } from "@/models/GameModel";
import ProgressStats from "../ProgressStats/ProgressStats";
import ColumnBadge from "../ColumnBadge/ColumnBadge";
import PlatformBadge from "../PlatformBadge/PlatformBadge";
import BoardCardMenu from "../BoardCardMenu/BoardCardMenu";
import Image from "next/image";
import clsx from "clsx";
import classes from "./BoardCard.module.css";
import { useRouter } from "next/navigation";

interface BoardCardProps {
  item: Game;
  interactive?: boolean;
  divider?: boolean;
  overlay?: boolean;
}

const CardOverlay: FC = () => {
  return (
    <Overlay
      zIndex={2}
      gradient="linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))"
    />
  );
};

const MemoizedOverlay = memo(CardOverlay);

const animateLayoutChanges: AnimateLayoutChanges = (args) => {
  const { isSorting, wasDragging } = args;
  if (isSorting || wasDragging) return defaultAnimateLayoutChanges(args);
  return true;
};

const BoardCard: FC<BoardCardProps> = (props) => {
  const { item, interactive = true, overlay = false, divider = false } = props;
  const { id, title, image_url, status, platform, progress } = item;

  const { push } = useRouter();
  const { spacing } = useMantineTheme();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, animateLayoutChanges, disabled: !interactive });

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    if (!interactive) return;
    const route = `/game/${id}`;
    push(route);
  };

  return (
    <Flex
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      aria-describedby=""
      suppressHydrationWarning
      className={clsx([classes.container, isDragging && classes.draggable])}
      direction="column"
      onClick={handleClick}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 99999 : undefined,
        visibility: isDragging && !overlay ? "hidden" : "unset",
        cursor: interactive ? "pointer" : "default",
        marginBottom: divider ? spacing.sm : 0,
      }}>
      <Flex className={classes.header}>
        <ColumnBadge status={status} />
        <PlatformBadge platform={platform} />
        {interactive && <BoardCardMenu item={item} />}
      </Flex>
      <Box className={classes.imageWrapper}>
        <Image
          className={classes.image}
          src={image_url}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt="image card"
          unoptimized
        />
        {platform === "ps5" && <MemoizedOverlay />}
        <Image
          className={classes.background}
          src={image_url}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt="image card"
          unoptimized
        />
      </Box>
      <Text mt={6} fw={500} lineClamp={2}>
        {title}
      </Text>
      <ProgressStats progress={progress} />
    </Flex>
  );
};

export default memo(BoardCard);