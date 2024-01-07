"use client";

import { Flex, Group, Title } from "@mantine/core";
import { type FC } from "react";
import { useGame } from "@/providers/GameProvider";
import { type TrophyCountItem } from "@/models/TrophyModel";
import Image from "../Image/Image";
import classes from "./GameInfo.module.css";
import ColumnBadge from "../ColumnBadge/ColumnBadge";
import PlatformBadge from "../PlatformBadge/PlatformBadge";
import ProgressStats from "../ProgressStats/ProgressStats";
import TrophyCounts from "../TrophyCounts/TrophyCounts";

const GameInfo: FC = () => {
  const { game, progress, trophies } = useGame();

  if (game === null) return null;

  const { title, status, platform, image_url } = game;
  const counts = trophies?.counts ?? null;
  const count = trophies?.count ?? null;
  const countsArray: TrophyCountItem[] =
    counts != null ? Object.entries(counts).reverse() : [];

  return (
    <Group className={classes.container}>
      <Image
        width="0"
        height="0"
        className={classes.icon}
        priority
        src={image_url}
        alt={title ?? "game image"}
      />
      <Flex className={classes.content}>
        <Title order={4} className={classes.title}>
          {title}
        </Title>
        <Group className={classes.row}>
          <ColumnBadge status={status} />
          <PlatformBadge platform={platform} />
          <TrophyCounts counts={countsArray} count={count} size="small" />
        </Group>
      </Flex>
      <ProgressStats width={{ base: "100%", md: 300 }} progress={progress} />
    </Group>
  );
};

export default GameInfo;
