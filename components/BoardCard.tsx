import { useSortable } from "@dnd-kit/sortable";
import { Box, Flex, Overlay, Text, createStyles } from "@mantine/core";
import Image from "next/image";
import { type FC } from "react";
import { CSS } from "@dnd-kit/utilities";
import { type IGame } from "@/models/GameModel";
import ColumnBadge from "./ColumnBadge";
import PlatformBadge from "./PlatformBadge";
import ProgressStats from "./ProgressStats";

interface IBoardCardProps {
  item: IGame;
}

const useStyles = createStyles(({ colors, radius, spacing }) => {
  return {
    container: {
      width: "100%",
      padding: spacing.xs,
      background: colors.primary[6],
      borderRadius: radius.md,
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
      justifyContent: "space-between",
      marginBottom: spacing.xs,
    },
  };
});

const BoardCard: FC<IBoardCardProps> = (props) => {
  const { item } = props;
  const { id, title, image_url, status, platform, progress } = item;

  const { classes, cx } = useStyles();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <Flex
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cx([classes.container, isDragging && classes.draggable])}
      direction="column"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <Flex className={classes.header}>
        <PlatformBadge platform={platform} />
        <ColumnBadge status={status} />
      </Flex>
      <Box className={classes.imageWrapper}>
        <Image
          className={classes.image}
          src={image_url}
          fill
          unoptimized
          alt="image card"
        />
        <Overlay
          zIndex={2}
          gradient="linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))"
        />
        <Image
          className={classes.background}
          src={image_url}
          fill
          unoptimized
          alt="image card"
        />
      </Box>
      <Text mt={6} lineClamp={2}>
        {title}
      </Text>
      <ProgressStats progress={progress} />
    </Flex>
  );
};

export default BoardCard;
