import { type IBoardItem } from "@/models/BoardModel";
import { Box, Flex, Text, createStyles } from "@mantine/core";
import Image from "next/image";
import { type FC } from "react";

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
  const { title, image_url } = item;

  const { classes } = useStyles();

  return (
    <Flex className={classes.container} direction="column">
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
