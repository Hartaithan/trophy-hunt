import { Flex, useMantineTheme } from "@mantine/core";
import { type FC } from "react";
import BoardColumn from "./BoardColumn";
import { type IBoardColumns, type BOARD_COLUMNS } from "@/models/BoardModel";

interface IBoardContainer {
  columns: IBoardColumns;
}

const BoardContainer: FC<IBoardContainer> = (props) => {
  const { columns } = props;
  const { spacing } = useMantineTheme();

  return (
    <Flex gap={spacing.xl} py={spacing.xl}>
      {Object.keys(columns).map((col) => {
        const key = col as BOARD_COLUMNS;
        const items = columns[key];
        return <BoardColumn key={col} column={key} items={items} />;
      })}
    </Flex>
  );
};

export default BoardContainer;
