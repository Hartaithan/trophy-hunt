import { type IPage } from "@/models/AppModel";
import { Text, Flex, Title } from "@mantine/core";
import { useRouter } from "next/router";

const GamePage: IPage = () => {
  const { query } = useRouter();
  return (
    <Flex w="100%" h="100%" direction="column" justify="center" align="center">
      <Title order={2}>GamePage</Title>
      <Text>query: {JSON.stringify(query, null, 2)}</Text>
    </Flex>
  );
};

export default GamePage;
