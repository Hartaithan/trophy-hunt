import { createClient } from "@/utils/supabase/server";
import { Flex, Title } from "@mantine/core";
import { type NextPage } from "next";
import { cookies } from "next/headers";

const Home: NextPage = async () => {
  const supabase = createClient(cookies());
  const { data } = await supabase.auth.getSession();

  return (
    <Flex h="100%" direction="column" justify="center" align="center">
      <Title mb="xs">Hello World!</Title>
      {data.session != null ? (
        <pre style={{ maxWidth: 400, overflow: "auto", fontSize: 8 }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <pre>please, sign in</pre>
      )}
    </Flex>
  );
};

export default Home;
