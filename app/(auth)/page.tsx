import HomeSection from "@/components/HomeSection/HomeSection";
import Landing from "@/components/Landing/Landing";
import SuccessNotification from "@/components/SuccessNotification/SuccessNotification";
import { API_URL } from "@/constants/api";
import { type Page } from "@/models/AppModel";
import { type Game } from "@/models/GameModel";
import { getRefreshedCookies } from "@/utils/cookies";
import { createClient } from "@/utils/supabase/server";
import { Flex } from "@mantine/core";
import { type Session } from "@supabase/supabase-js";
import { cookies } from "next/headers";

interface Params {
  success: string | undefined;
}

interface Response {
  games: Game[];
  session: Session | null;
}

const fetchHomeData = async (): Promise<Response> => {
  const refreshedCookies = getRefreshedCookies();
  const supabase = createClient(cookies());
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session === null) return { games: [], session };
  const response = await fetch(`${API_URL}/games/recent`, {
    headers: { Cookie: refreshedCookies },
  });
  const { games = [] } = await response.json();
  return { games, session };
};

const Home: Page<unknown, Params> = async ({ searchParams: { success } }) => {
  const data = await fetchHomeData();

  return (
    <Flex direction="column" h="100%" py="xl">
      {data.session != null ? (
        <HomeSection games={data.games} session={data.session} />
      ) : (
        <Landing />
      )}
      <SuccessNotification success={success} />
    </Flex>
  );
};

export default Home;
