import { BOARD_COLUMNS, columnsLabels } from "@/models/BoardModel";
import { type Range } from "@/helpers/types";
import {
  Text,
  Box,
  Flex,
  createStyles,
  type MantineColor,
  useMantineTheme,
} from "@mantine/core";
import { type FC } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import BoardCard from "./BoardCard";
import { type IGame } from "@/models/GameModel";

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

interface IBoardColumnProps {
  column: BOARD_COLUMNS;
  items: IGame[];
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
        flex: 1,
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
      label: {
        color: colors.secondary[9],
        fontSize: 14,
      },
    };
  }
);

const BoardColumn: FC<IBoardColumnProps> = (props) => {
  const { column, items } = props;
  const { classes } = useStyles({ column });
  const { spacing } = useMantineTheme();
  const { setNodeRef } = useDroppable({ id: column });

  return (
    <SortableContext
      id={column}
      items={items}
      strategy={verticalListSortingStrategy}
    >
      <Flex className={classes.column} direction="column">
        <Box className={classes.header}>
          <Text className={classes.label}>{columnsLabels[column]}</Text>
        </Box>
        <Flex direction="column" gap={spacing.sm} ref={setNodeRef}>
          {items.map((item) => (
            <BoardCard key={item.id} item={item} />
          ))}
        </Flex>
      </Flex>
    </SortableContext>
  );
};

export default BoardColumn;
