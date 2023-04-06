import { type IBoardItem } from "@/models/BoardModel";
import { useSortable } from "@dnd-kit/sortable";
import { Box, Flex, Text, createStyles } from "@mantine/core";
import Image from "next/image";
import { type FC } from "react";
import { CSS } from "@dnd-kit/utilities";

interface IBoardCardProps {
  item: IBoardItem;
}

const useStyles = createStyles(({ colors, radius, spacing }) => ({
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
  overlay: {
    zIndex: 2,
    width: "100%",
    height: "100%",
    background: "linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))",
  },
  background: {
    objectFit: "cover",
    zIndex: 1,
    filter: "blur(5px)",
  },
}));

const BoardCard: FC<IBoardCardProps> = (props) => {
  const { item } = props;
  const { id, title, image_url } = item;

  const { classes } = useStyles();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  return (
    <Flex
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={classes.container}
      direction="column"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <Box className={classes.imageWrapper}>
        <Image
          className={classes.image}
          src={image_url}
          fill
          unoptimized
          alt="image card"
        />
        <div className={classes.overlay} />
        <Image
          className={classes.background}
          src={image_url}
          fill
          unoptimized
          alt="image card"
        />
      </Box>
      <Text mt={6}>{title}</Text>
    </Flex>
  );
};

export default BoardCard;
