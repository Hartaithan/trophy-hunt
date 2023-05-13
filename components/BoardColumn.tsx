import { type BOARD_COLUMNS } from "@/models/BoardModel";
import {
  Text,
  Flex,
  createStyles,
  useMantineTheme,
  UnstyledButton,
} from "@mantine/core";
import { type FC } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import BoardCard from "./BoardCard";
import { type IGame } from "@/models/GameModel";
import { PlaylistAdd } from "tabler-icons-react";
import { columnColors, columnsLabels } from "@/constants/board";
import { useBoard } from "@/providers/BoardProvider";

interface IBoardColumnProps {
  column: BOARD_COLUMNS;
  items: IGame[];
}

const useStyles = createStyles(
  (
    { radius, colors, spacing, fontSizes },
    { column }: { column: BOARD_COLUMNS }
  ) => {
    const { color, shade } = columnColors[column];
    return {
      column: {
        position: "relative",
        padding: spacing.xs,
        paddingTop: 0,
        background: colors.primary[7],
        borderRadius: radius.lg,
        minWidth: 300,
        flex: 1,
      },
      overlay: {
        position: "fixed",
        top: spacing.xl,
        width: "100%",
        height: 20,
        background: "red",
      },
      header: {
        position: "sticky",
        top: -1,
        width: "100%",
        borderBottom: `3px ${colors[color][shade]} solid`,
        padding: "6px 8px",
        paddingTop: spacing.sm,
        marginBottom: spacing.md,
        zIndex: 100,
        alignItems: "center",
        background: `linear-gradient(180deg, ${colors.primary[7]} 0%, ${colors.primary[7]} 70%, transparent 160%)`,
      },
      label: {
        color: colors.secondary[9],
        fontSize: fontSizes.sm,
        ":before": {
          content: "''",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: colors[color][shade],
          display: "inline-block",
          marginRight: spacing.xs,
        },
      },
      count: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        height: "80%",
        aspectRatio: "1 / 1",
        marginLeft: spacing.xs,
        background: colors.gray[8],
      },
      add: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: colors[color][shade] + "33",
        borderRadius: radius.sm,
        height: "100%",
        aspectRatio: "1 / 1",
        marginLeft: "auto",
        transform: "translateX(4px)",
        "& > svg": {
          stroke: colors[color][shade],
        },
      },
    };
  }
);

const BoardColumn: FC<IBoardColumnProps> = (props) => {
  const { column, items } = props;
  const { classes } = useStyles({ column });
  const { spacing } = useMantineTheme();
  const { setNodeRef } = useDroppable({ id: column });
  const { addGameModal } = useBoard();

  const handleAddGame = (): void => {
    addGameModal.open(column);
  };

  return (
    <SortableContext
      id={column}
      items={items}
      strategy={verticalListSortingStrategy}
    >
      <Flex className={classes.column} direction="column">
        <Flex className={classes.header}>
          <Text className={classes.label} fw={500}>
            {columnsLabels[column]}
          </Text>
          <Text className={classes.count} size={10} fw={600} align="center">
            {items.length}
          </Text>
          <UnstyledButton className={classes.add} onClick={handleAddGame}>
            <PlaylistAdd size={20} />
          </UnstyledButton>
        </Flex>
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
