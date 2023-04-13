import { type IPage } from "@/models/AppModel";
import { useProfile } from "@/providers/PSNProvider";
import { Flex, Title, Text, Button, Group } from "@mantine/core";
import { useSession, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";

const Home: IPage = () => {
  const user = useUser();
  const session = useSession();
  const { profile, updateProfile } = useProfile();

  return (
    <Flex h="100%" justify="center" align="center" direction="column" gap={12}>
      <Title>Hello world!</Title>
      <Button onClick={() => updateProfile()}>update</Button>
      <Link href="/board" prefetch={false}>
        to /board
      </Link>
      <Group align="flex-start">
        <Text
          component="pre"
          w={400}
          size={10}
          style={{ whiteSpace: "break-spaces", wordBreak: "break-all" }}
        >
          user: {JSON.stringify(user, null, 2)}
        </Text>
        <Text
          component="pre"
          w={400}
          size={10}
          style={{ whiteSpace: "break-spaces", wordBreak: "break-all" }}
        >
          session: {JSON.stringify(session, null, 2)}
        </Text>
        <Text
          component="pre"
          w={400}
          size={10}
          style={{ whiteSpace: "break-spaces", wordBreak: "break-all" }}
        >
          psn_profile: {JSON.stringify(profile, null, 2)}
        </Text>
      </Group>
    </Flex>
  );
};

export default Home;
