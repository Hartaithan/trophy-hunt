import { type IPage } from "@/models/AppModel";
import { Flex, Title } from "@mantine/core";

const BoardPage: IPage = () => {
  return (
    <Flex h="100%" justify="center" align="center" direction="column">
      <Title>Board Page!</Title>
    </Flex>
  );
};

export default BoardPage;
