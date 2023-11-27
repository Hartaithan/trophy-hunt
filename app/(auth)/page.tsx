import SuccessNotification from "@/components/SuccessNotification/SuccessNotification";
import { type Page } from "@/models/AppModel";
import { createClient } from "@/utils/supabase/server";
import { Flex, Title } from "@mantine/core";
import { cookies } from "next/headers";

interface Params {
  success: string | undefined;
}

const Home: Page<unknown, Params> = async ({ searchParams: { success } }) => {
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
      <SuccessNotification success={success} />
    </Flex>
  );
};

export default Home;
