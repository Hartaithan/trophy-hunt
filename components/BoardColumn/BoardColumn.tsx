"use client";

import { type BOARD_COLUMNS } from "@/models/BoardModel";
import {
  Text,
  Flex,
  UnstyledButton,
  Button,
  Transition,
  useMantineTheme,
  Box,
} from "@mantine/core";
import { useState, type FC } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import BoardCard from "../BoardCard/BoardCard";
import { type Game } from "@/models/GameModel";
import { IconArticleOff, IconPlaylistAdd } from "@tabler/icons-react";
import { columnColors, columnsLabels } from "@/constants/board";
import { useBoard } from "@/providers/BoardProvider";
import { Virtuoso as VerticalList } from "react-virtuoso";
import HorizontalList, { ScrollDirection } from "react-retiny-virtual-list";
import classes from "./BoardColumn.module.css";
import { useMediaQuery } from "@mantine/hooks";

interface BoardColumnProps {
  column: BOARD_COLUMNS;
  items: Game[];
  interactive?: boolean;
}

const BoardColumn: FC<BoardColumnProps> = (props) => {
  const { column, items, interactive = true } = props;
  const { setNodeRef } = useDroppable({ id: column, disabled: !interactive });
  const { addGameModal } = useBoard();
  const { colors } = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: 62em)`);
  const strategy =
    isMobile === true
      ? horizontalListSortingStrategy
      : verticalListSortingStrategy;
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);

  const { color, shade } = columnColors[column];

  const handleAddGame = (): void => {
    if (!interactive) return;
    addGameModal.open(column);
  };

  return (
    <SortableContext id={column} items={items} strategy={strategy}>
      <Flex className={classes.column} direction="column">
        <Flex
          className={classes.header}
          style={{ borderBottom: `3px ${colors[color][shade]} solid` }}>
          <Flex align="center">
            <Box className={classes.labelDot} bg={colors[color][shade]} />
            <Text className={classes.label} fw={500}>
              {columnsLabels[column]}
            </Text>
          </Flex>
          <Text className={classes.count} size="xs" fw={600} ta="center">
            {items.length}
          </Text>
          {interactive && (
            <UnstyledButton
              className={classes.add}
              bg={colors[color][shade] + 33}
              onClick={handleAddGame}>
              <IconPlaylistAdd size={20} color={colors[color][shade]} />
            </UnstyledButton>
          )}
        </Flex>
        <Flex className={classes.listWrapper} ref={setNodeRef}>
          <Transition
            mounted={items.length === 0}
            transition="fade"
            duration={400}
            timingFunction="ease">
            {(styles) => (
              <Flex className={classes.empty} style={styles}>
                <IconArticleOff size={100} color={colors[color][shade]} />
                <Text ta="center" fw={500}>
                  <Text id="column" span c={colors[color][shade]}>
                    [{columnsLabels[column]}]{" "}
                  </Text>
                  column is empty
                </Text>
                {interactive && (
                  <Button
                    onClick={handleAddGame}
                    leftSection={<IconPlaylistAdd size={20} />}
                    size="compact-sm"
                    bg={colors[color][shade]}>
                    Add game
                  </Button>
                )}
              </Flex>
            )}
          </Transition>
          {isMobile === true ? (
            <HorizontalList
              width="100%"
              height={250}
              itemCount={items.length}
              itemSize={200}
              scrollDirection={ScrollDirection.HORIZONTAL}
              renderItem={({ index, style }) => {
                const item = items[index];
                const isLast = index + 1 === items.length;
                const left = style.left + (index - visibleStartIndex) * 10;
                return (
                  <BoardCard
                    key={item.id}
                    item={item}
                    divider={!isLast}
                    interactive={interactive}
                    style={style}
                    offset={left}
                  />
                );
              }}
              onItemsRendered={({ startIndex }) => {
                setVisibleStartIndex(startIndex);
              }}
            />
          ) : (
            <VerticalList
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
          )}
        </Flex>
      </Flex>
    </SortableContext>
  );
};

export default BoardColumn;
