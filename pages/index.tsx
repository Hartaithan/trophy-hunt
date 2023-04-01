import { type IPage } from "@/models/AppModel";
import { Flex, Title, Text } from "@mantine/core";
import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";

const Home: IPage = () => {
  const user = useUser();
  return (
    <Flex h="100%" justify="center" align="center" direction="column">
      <Title>Hello world!</Title>
      <Text component="pre">{JSON.stringify(user, null, 2)}</Text>
      <Link href="/board" prefetch={false}>
        to /board
      </Link>
    </Flex>
  );
};

export default Home;
