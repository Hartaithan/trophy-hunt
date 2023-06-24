import {
  type AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
  useSortable,
} from "@dnd-kit/sortable";
import { Box, Flex, Text, createStyles } from "@mantine/core";
import Image from "./Image";
import { memo, type FC, type MouseEventHandler } from "react";
import { CSS } from "@dnd-kit/utilities";
import { type IGame } from "@/models/GameModel";
import ColumnBadge from "./ColumnBadge";
import PlatformBadge from "./PlatformBadge";
import ProgressStats from "./ProgressStats";
import { useRouter } from "next/router";
import BoardCardMenu from "./BoardCardMenu";
import BoardCardOverlay from "./BoardCardOverlay";

interface IBoardCardProps {
  item: IGame;
}

const animateLayoutChanges: AnimateLayoutChanges = (args) => {
  const { isSorting, wasDragging } = args;
  if (isSorting || wasDragging) return defaultAnimateLayoutChanges(args);
  return true;
};

const useStyles = createStyles(({ colors, radius, spacing }) => ({
  container: {
    width: "100%",
    padding: spacing.xs,
    background: colors.primary[6],
    borderRadius: radius.md,
    cursor: "pointer",
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    aspectRatio: "320 / 176",
    overflow: "hidden",
    borderRadius: radius.md,
  },
  image: {
    objectFit: "contain",
    zIndex: 3,
    filter:
      "drop-shadow(0 0 100px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 100px rgba(0, 0, 0, 0.9))",
  },
  background: {
    objectFit: "cover",
    zIndex: 1,
    filter: "blur(5px)",
  },
  draggable: {
    zIndex: 99999,
  },
  header: {
    justifyContent: "flex-start",
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
}));

const BoardCard: FC<IBoardCardProps> = (props) => {
  const { item } = props;
  const { id, title, image_url, status, platform, progress } = item;

  const { push } = useRouter();
  const { classes, cx } = useStyles();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, animateLayoutChanges });

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    const route = `/game/${id}`;
    push(route).finally(() => console.info(`routed to ${route}`));
  };

  return (
    <Flex
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      aria-describedby=""
      suppressHydrationWarning
      className={cx([classes.container, isDragging && classes.draggable])}
      direction="column"
      onClick={handleClick}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <Flex className={classes.header}>
        <ColumnBadge status={status} />
        <PlatformBadge platform={platform} />
        <BoardCardMenu item={item} />
      </Flex>
      <Box className={classes.imageWrapper}>
        <Image
          className={classes.image}
          src={image_url}
          fill
          alt="image card"
        />
        {platform === "ps5" && <BoardCardOverlay />}
        <Image
          className={classes.background}
          src={image_url}
          fill
          alt="image card"
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
