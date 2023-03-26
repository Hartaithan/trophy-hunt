import { type IPage } from "@/models/AppModel";
import { Flex, Title, Text } from "@mantine/core";
import { useUser } from "@supabase/auth-helpers-react";

const Home: IPage = () => {
  const user = useUser();
  return (
    <Flex h="100%" justify="center" align="center" direction="column">
      <Title>Hello world!</Title>
      <Text component="pre">{JSON.stringify(user, null, 2)}</Text>
    </Flex>
  );
};

export default Home;
