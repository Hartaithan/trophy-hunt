import { type IPage } from "@/models/AppModel";
import { useProfiles } from "@/providers/ProfileProvider";
import { Flex, Title, Text, Button, Group } from "@mantine/core";
import { useSession } from "@supabase/auth-helpers-react";

const Home: IPage = () => {
  const session = useSession();
  const { profile, psn, updatePSNProfile } = useProfiles();

  return (
    <Flex justify="center" align="center" direction="column" gap={12} py={24}>
      <Title>Hello world!</Title>
      <Button onClick={() => updatePSNProfile()}>update</Button>
      <Group align="flex-start">
        <Text
          component="pre"
          w={400}
          size={8}
          style={{ whiteSpace: "break-spaces", wordBreak: "break-all" }}
        >
          session: {JSON.stringify(session, null, 2)}
        </Text>
        <Text
          component="pre"
          w={400}
          size={8}
          style={{ whiteSpace: "break-spaces", wordBreak: "break-all" }}
        >
          profile: {JSON.stringify(profile, null, 2)}
        </Text>
        <Text
          component="pre"
          w={400}
          size={8}
          style={{ whiteSpace: "break-spaces", wordBreak: "break-all" }}
        >
          psn_profile: {JSON.stringify(psn, null, 2)}
        </Text>
      </Group>
    </Flex>
  );
};

export default Home;
