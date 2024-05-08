"use client";

import { Flex, type FlexProps, Text } from "@mantine/core";
import { memo, type FC } from "react";
import { type Game } from "@/models/GameModel";
import ProgressStats from "../ProgressStats/ProgressStats";
import ColumnBadge from "../ColumnBadge/ColumnBadge";
import PlatformBadge from "../PlatformBadge/PlatformBadge";
import clsx from "clsx";
import classes from "./BoardLinkCard.module.css";
import Link from "../Link/Link";
import GameThumbnail from "../GameThumbnail/GameThumbnail";

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
      <GameThumbnail url={image_url} overlay={platform === "ps5"} />
      <Text className={classes.title} lineClamp={2}>
        {title}
      </Text>
      <ProgressStats progress={progress} size="small" />
    </Flex>
  );
};

export default memo(BoardLinkCard);
