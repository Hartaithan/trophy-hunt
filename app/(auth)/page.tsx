import HomeSection from "@/components/HomeSection/HomeSection";
import Landing from "@/components/Landing/Landing";
import SuccessNotification from "@/components/SuccessNotification/SuccessNotification";
import { type Page } from "@/models/AppModel";
import { createClient } from "@/utils/supabase/server";
import { Flex } from "@mantine/core";
import { cookies } from "next/headers";

interface Params {
  success: string | undefined;
}

const Home: Page<unknown, Params> = async ({ searchParams: { success } }) => {
  const supabase = createClient(cookies());
  const { data } = await supabase.auth.getSession();

  return (
    <Flex h="100%" direction="column">
      {data.session != null ? (
        <HomeSection session={data.session} />
      ) : (
        <Landing />
      )}
      <SuccessNotification success={success} />
    </Flex>
  );
};

export default Home;
