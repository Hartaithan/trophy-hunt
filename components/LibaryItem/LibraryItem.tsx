import { ActionIcon, Flex, Text } from "@mantine/core";
import { type TrophyTitle } from "psn-api";
import { type FC } from "react";
import classes from "./LibraryItem.module.css";
import GameThumbnail from "../GameThumbnail/GameThumbnail";
import PlatformBadge from "../PlatformBadge/PlatformBadge";
import { IconPlus } from "@tabler/icons-react";

interface Props {
  item: TrophyTitle;
  handleAdd?: (title: TrophyTitle) => void;
}

const LibraryItem: FC<Props> = (props) => {
  const { item, handleAdd } = props;
  return (
    <Flex className={classes.container}>
      <GameThumbnail
        className={classes.thumbnail}
        url={item.trophyTitleIconUrl}
        overlay={item.trophyTitlePlatform === "PS5"}
      />
      <Flex className={classes.content}>
        <PlatformBadge platform={item.trophyTitlePlatform} />
        <Text className={classes.title}>{item.trophyTitleName}</Text>
      </Flex>
      <ActionIcon
        className={classes.add}
        variant="filled"
        onClick={() => {
          handleAdd != null && handleAdd(item);
        }}>
        <IconPlus size={18} />
        <Text size="xs">Add</Text>
      </ActionIcon>
    </Flex>
  );
};

export default LibraryItem;
