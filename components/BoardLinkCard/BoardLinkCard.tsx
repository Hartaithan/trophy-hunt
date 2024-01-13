"use client";

import { Box, Flex, type FlexProps, Text } from "@mantine/core";
import { memo, type FC } from "react";
import { type Game } from "@/models/GameModel";
import ProgressStats from "../ProgressStats/ProgressStats";
import ColumnBadge from "../ColumnBadge/ColumnBadge";
import PlatformBadge from "../PlatformBadge/PlatformBadge";
import Image from "../Image/Image";
import clsx from "clsx";
import classes from "./BoardLinkCard.module.css";
import BoardCardOverlay from "../BoardCardOverlay/BoardCardOverlay";
import Link from "next/link";

interface BoardLinkCardProps extends FlexProps {
  item: Game;
  className?: string;
}

const BoardLinkCard: FC<BoardLinkCardProps> = (props) => {
  const { item, className = "", ...rest } = props;
  const { id, title, image_url, status, platform, progress } = item;

  return (
    <Flex
      component={Link}
      href={`/game/${id}`}
      className={clsx([className, classes.container])}
      direction="column"
      {...rest}>
      <Flex className={classes.header}>
        <ColumnBadge status={status} />
        <PlatformBadge platform={platform} />
      </Flex>
      <Box className={classes.imageWrapper}>
        <Image
          className={classes.image}
          src={image_url}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt="image card"
        />
        {platform === "ps5" && <BoardCardOverlay />}
        <Image
          className={classes.background}
          src={image_url}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt="image card"
        />
      </Box>
      <Text className={classes.title} lineClamp={2}>
        {title}
      </Text>
      <ProgressStats progress={progress} size="small" />
    </Flex>
  );
};

export default memo(BoardLinkCard);
