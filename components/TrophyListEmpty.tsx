import { Text } from "@mantine/core";
import {
  type CollapseProps,
  createStyles,
  Collapse,
  Flex,
} from "@mantine/core";
import { IconMoodSad } from "@tabler/icons-react";
import { memo, type FC } from "react";

const useStyles = createStyles(({ colors, radius, spacing }) => ({
  collapsible: {
    position: "relative",
    top: spacing.xl,
  },
  empty: {
    height: 130,
    width: "100%",
    background: colors.primary[7],
    borderRadius: radius.lg,
    padding: spacing.sm,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const TrophyListEmpty: FC<Pick<CollapseProps, "in">> = (props) => {
  const { classes } = useStyles();
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
