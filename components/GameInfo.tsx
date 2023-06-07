import { Button, Flex, Group, Title, createStyles } from "@mantine/core";
import Image from "next/image";
import { type FC } from "react";
import ProgressStats from "./ProgressStats";
import PlatformBadge from "./PlatformBadge";
import ColumnBadge from "./ColumnBadge";
import { useGame } from "@/providers/GameProvider";
import { CloudDownload } from "tabler-icons-react";

const useStyles = createStyles(({ radius }) => ({
  container: {
    width: "100%",
  },
  content: {
    flexDirection: "column",
    flex: 1,
  },
  icon: {
    minHeight: 100,
    width: "auto",
    objectFit: "contain",
    borderRadius: radius.md,
  },
}));

const GameInfo: FC = () => {
  const { game, progress, syncProgress } = useGame();
  const { classes } = useStyles();

  if (game === null) return null;

  const { title, status, platform, image_url } = game;

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
        <Button
          mt="xs"
          compact
          leftIcon={<CloudDownload size={20} />}
          w="fit-content"
          onClick={() => syncProgress()}
        >
          Sync
        </Button>
      </Flex>
      <ProgressStats width={300} progress={progress} />
    </Group>
  );
};

export default GameInfo;
