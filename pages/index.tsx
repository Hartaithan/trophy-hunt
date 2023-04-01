import { type IPage } from "@/models/AppModel";
import { useProfile } from "@/providers/PSNProvider";
import { Flex, Title, Text, Button } from "@mantine/core";
import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";

const Home: IPage = () => {
  const user = useUser();
  const { profile, updateProfile } = useProfile();
  return (
    <Flex h="100%" justify="center" align="center" direction="column" gap={12}>
      <Title>Hello world!</Title>
      <Button onClick={() => updateProfile()}>update</Button>
      <Link href="/board" prefetch={false}>
        to /board
      </Link>
      <Flex>
        <Text component="pre" size={10}>
          {JSON.stringify(user, null, 2)}
        </Text>
        <Text component="pre" size={10}>
          {JSON.stringify(profile, null, 2)}
        </Text>
      </Flex>
    </Flex>
  );
};

export default Home;
