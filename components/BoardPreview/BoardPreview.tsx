"use client";

import { type BOARD_COLUMNS, type BoardColumns } from "@/models/BoardModel";
import { Flex, Text, Title } from "@mantine/core";
import { IconMoodSadDizzy } from "@tabler/icons-react";
import { Fragment, type FC } from "react";
import BoardColumn from "../BoardColumn/BoardColumn";
import classes from "./BoardPreview.module.css";

interface Props {
  isReady: boolean;
  board: BoardColumns;
}

const BoardPreview: FC<Props> = (props) => {
  const { isReady, board } = props;
  return (
    <Fragment>
      {isReady ? (
        <Flex className={classes.container} gap="xl">
          {Object.keys(board).map((col) => {
            const key = col as BOARD_COLUMNS;
            const items = board[key];
            return (
              <BoardColumn
                key={col}
                column={key}
                items={items}
                interactive={false}
              />
            );
          })}
        </Flex>
      ) : (
        <Flex className={classes.private}>
          <IconMoodSadDizzy size={120} />
          <Title order={3}>Board not exist!</Title>
          <Text c="dimmed">
            Or the user is restricted from accessing their board.
          </Text>
        </Flex>
      )}
    </Fragment>
  );
};

export default BoardPreview;
