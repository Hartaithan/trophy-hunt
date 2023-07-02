import { Flex, Group, Title, createStyles } from "@mantine/core";
import Image from "./Image";
import { type FC } from "react";
import ProgressStats from "./ProgressStats";
import PlatformBadge from "./PlatformBadge";
import ColumnBadge from "./ColumnBadge";
import { useGame } from "@/providers/GameProvider";
import { type TrophyCountItem } from "@/models/TrophyModel";
import TrophyCounts from "./TrophyCounts";

const useStyles = createStyles(({ radius }) => ({
  container: {
    width: "100%",
  },
  content: {
    flexDirection: "column",
    flex: 1,
  },
  icon: {
    width: "auto",
    objectFit: "contain",
    borderRadius: radius.md,
  },
}));

const GameInfo: FC = () => {
  const { game, progress, trophies } = useGame();
  const { classes } = useStyles();

  if (game === null) return null;

  const { title, status, platform, image_url } = game;
  const counts = trophies?.counts ?? null;
  const countsArray: TrophyCountItem[] =
    counts != null ? Object.entries(counts).reverse() : [];

  return (
    <Group className={classes.container}>
      <Image
        width={250}
        height={100}
        className={classes.icon}
        priority
        src={image_url}
        alt={title ?? "game image"}
      />
      <Flex className={classes.content}>
        <Title order={4}>{title}</Title>
        <Group mt={4}>
          <ColumnBadge status={status} />
          <PlatformBadge platform={platform} />
          <TrophyCounts counts={countsArray} size="small" />
        </Group>
      </Flex>
      <ProgressStats width={300} progress={progress} />
    </Group>
  );
};

export default GameInfo;
