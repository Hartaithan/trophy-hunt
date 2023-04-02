import { Flex, useMantineTheme } from "@mantine/core";
import { type FC, type PropsWithChildren } from "react";

type IBoardContainer = PropsWithChildren;

const BoardContainer: FC<IBoardContainer> = (props) => {
  const { children } = props;
  const { spacing } = useMantineTheme();

  return (
    <Flex gap={spacing.xl} py={spacing.xl}>
      {children}
    </Flex>
  );
};

export default BoardContainer;
