import { type IGame } from "@/models/GameModel";
import { Flex, Group, Title, createStyles } from "@mantine/core";
import Image from "next/image";
import { type FC } from "react";
import ProgressStats from "./ProgressStats";
import PlatformBadge from "./PlatformBadge";
import ColumnBadge from "./ColumnBadge";

interface IGameInfoProps {
  game: IGame | null;
}

const useStyles = createStyles(() => ({
  container: {
    width: "100%",
  },
  content: {
    flexDirection: "column",
    flex: 1,
  },
  icon: { height: "auto", objectFit: "contain" },
}));

const GameInfo: FC<IGameInfoProps> = (props) => {
  const { game } = props;
  const { classes } = useStyles();

  if (game === null) return null;

  const { title, status, platform, image_url, progress } = game;

  return (
    <Group className={classes.container}>
      <Image
        width={250}
        height={100}
        className={classes.icon}
        src={image_url}
        alt={title ?? "game image"}
        unoptimized
      />
      <Flex className={classes.content}>
        <Title order={4} mb={4}>
          {title}
        </Title>
        <Group>
          <ColumnBadge status={status} />
          <PlatformBadge platform={platform} />
        </Group>
      </Flex>
      <ProgressStats width={300} progress={progress} />
    </Group>
  );
};

export default GameInfo;
