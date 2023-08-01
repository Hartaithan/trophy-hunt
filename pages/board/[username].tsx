import { Flex, Text, Title } from "@mantine/core";
import { useRouter } from "next/router";
import { type FC } from "react";

const BoardPage: FC = () => {
  const { query } = useRouter();
  return (
    <Flex direction="column" py="xl">
      <Title order={3} mb="md">
        Board Page
      </Title>
      <Text c="dimmed">username: {query.username}</Text>
    </Flex>
  );
};

export default BoardPage;
