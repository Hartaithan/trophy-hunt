import { type BOARD_COLUMNS } from "@/models/BoardModel";
import {
  Text,
  Flex,
  createStyles,
  UnstyledButton,
  Button,
  Transition,
} from "@mantine/core";
import { type FC } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import BoardCard from "./BoardCard";
import { type IGame } from "@/models/GameModel";
import { IconArticleOff, IconPlaylistAdd } from "@tabler/icons-react";
import { columnColors, columnsLabels } from "@/constants/board";
import { useBoard } from "@/providers/BoardProvider";
import { Virtuoso } from "react-virtuoso";

interface IBoardColumnProps {
  column: BOARD_COLUMNS;
  items: IGame[];
  interactive?: boolean;
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
        background: colors.primary[7],
        borderRadius: radius.lg,
        minWidth: 300,
        flex: 1,
      },
      header: {
        height: 35,
        width: "100%",
        borderBottom: `3px ${colors[color][shade]} solid`,
        padding: `2px ${spacing.xs} 6px ${spacing.xs}`,
        marginBottom: spacing.sm,
        alignItems: "center",
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
      listWrapper: {
        position: "relative",
        flex: 1,
        "& > div": {
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      },
      list: {
        height: "100%",
        "& > div > div": {
          height: "100%",
        },
      },
      empty: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: 250,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: spacing.lg,
        zIndex: 1,
        "& > svg": {
          stroke: colors[color][shade],
          marginBottom: -12,
        },
        "& > button": {
          background: colors[color][shade],
          ":hover": {
            background: colors[color][shade] + "80",
          },
        },
        "& > div > #column": {
          color: colors[color][shade],
          filter: "brightness(1.3)",
        },
      },
    };
  }
);

const BoardColumn: FC<IBoardColumnProps> = (props) => {
  const { column, items, interactive = true } = props;
  const { classes } = useStyles({ column });
  const { setNodeRef } = useDroppable({ id: column, disabled: !interactive });
  const { addGameModal } = useBoard();

  const handleAddGame = (): void => {
    if (!interactive) return;
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
          {interactive && (
            <UnstyledButton className={classes.add} onClick={handleAddGame}>
              <IconPlaylistAdd size={20} />
            </UnstyledButton>
          )}
        </Flex>
        <Flex
          className={classes.listWrapper}
          direction="column"
          ref={setNodeRef}
        >
          <Transition
            mounted={items.length === 0}
            transition="fade"
            duration={400}
            timingFunction="ease"
          >
            {(styles) => (
              <Flex className={classes.empty} style={styles}>
                <IconArticleOff size={100} />
                <Text align="center" fw={500}>
                  <Text id="column" span>
                    [{columnsLabels[column]}]{" "}
                  </Text>
                  column is empty
                </Text>
                {interactive && (
                  <Button
                    onClick={handleAddGame}
                    leftIcon={<IconPlaylistAdd size={20} />}
                    compact
                  >
                    Add game
                  </Button>
                )}
              </Flex>
            )}
          </Transition>
          <Virtuoso
            data={items}
            className={classes.list}
            totalCount={items.length}
            itemContent={(index, item) => {
              const isLast = index + 1 === items.length;
              return (
                <BoardCard
                  key={item.id}
                  item={item}
                  divider={!isLast}
                  interactive={interactive}
                />
              );
            }}
          />
        </Flex>
      </Flex>
    </SortableContext>
  );
};

export default BoardColumn;
