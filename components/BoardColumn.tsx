import { BOARD_COLUMNS, type IBoardColumn } from "@/models/BoardModel";
import { type Range } from "@/helpers/types";
import {
  Text,
  Box,
  Flex,
  createStyles,
  type MantineColor,
  useMantineTheme,
} from "@mantine/core";
import { type FC, type PropsWithChildren } from "react";

interface IColumnColor {
  color: MantineColor;
  shade: Range<0, 10>;
}

const columnColors: Record<BOARD_COLUMNS, IColumnColor> = {
  [BOARD_COLUMNS.Backlog]: {
    color: "gray",
    shade: 8,
  },
  [BOARD_COLUMNS.InProgress]: {
    color: "green",
    shade: 9,
  },
  [BOARD_COLUMNS.Platinum]: {
    color: "blue",
    shade: 9,
  },
  [BOARD_COLUMNS.Complete]: {
    color: "red",
    shade: 9,
  },
};

interface IBoardColumnProps extends PropsWithChildren {
  column: IBoardColumn;
}

const useStyles = createStyles(
  ({ radius, colors, spacing }, { column }: { column: BOARD_COLUMNS }) => {
    const { color, shade } = columnColors[column];
    const background = colors[color][shade];
    return {
      column: {
        padding: spacing.xs,
        background: colors.primary[7],
        borderRadius: radius.lg,
        minWidth: 300,
      },
      header: {
        position: "sticky",
        top: spacing.xl,
        width: "100%",
        background,
        borderRadius: radius.md,
        padding: "6px 8px",
        marginBottom: spacing.md,
        zIndex: 100,
      },
      title: {
        color: colors.secondary[9],
        fontSize: 14,
      },
    };
  }
);

const BoardColumn: FC<IBoardColumnProps> = (props) => {
  const { children, column } = props;
  const { classes } = useStyles({ column: column.title });
  const { spacing } = useMantineTheme();

  return (
    <Flex className={classes.column} direction="column">
      <Box className={classes.header}>
        <Text className={classes.title}>{column.title}</Text>
      </Box>
      <Flex direction="column" gap={spacing.sm}>
        {children}
      </Flex>
    </Flex>
  );
};

export default BoardColumn;
