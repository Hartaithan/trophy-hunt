import { Text } from "@mantine/core";
import { type CollapseProps, Collapse, Flex } from "@mantine/core";
import { IconMoodSad } from "@tabler/icons-react";
import { memo, type FC } from "react";
import classes from "./TrophyListEmpty.module.css";

const TrophyListEmpty: FC<Pick<CollapseProps, "in">> = (props) => {
  return (
    <Collapse in={props.in} className={classes.collapsible}>
      <Flex className={classes.empty}>
        <IconMoodSad size={60} />
        <Text fw="bold" size="md" mt={4}>
          I couldn&apos;t find any trophies for the selected filters
        </Text>
      </Flex>
    </Collapse>
  );
};

export default memo(TrophyListEmpty);
