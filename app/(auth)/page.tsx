import HomeSection from "@/components/HomeSection/HomeSection";
import Landing from "@/components/Landing/Landing";
import SuccessNotification from "@/components/SuccessNotification/SuccessNotification";
import { API_URL } from "@/constants/api";
import { type Page } from "@/models/AppModel";
import { type BoardStats } from "@/models/BoardModel";
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
  stats: BoardStats | null;
  session: Session | null;
}

const fetchHomeData = async (): Promise<Response> => {
  const refreshedCookies = getRefreshedCookies();
  const supabase = createClient(cookies());
  const {
    data: { session },
  } = await supabase.auth.getSession();
  let games: Game[] = [];
  let stats: BoardStats | null = null;
  if (session === null) return { games, stats, session };
  const [recentRes, statsRes] = await Promise.allSettled([
    fetch(`${API_URL}/games/recent`, {
      headers: { Cookie: refreshedCookies },
    }).then(async (res) => await res.json()),
    fetch(`${API_URL}/games/stats`, {
      headers: { Cookie: refreshedCookies },
    }).then(async (res) => await res.json()),
  ]);
  if (recentRes.status === "fulfilled") {
    games = recentRes.value?.games ?? [];
  }
  if (statsRes.status === "fulfilled") {
    stats = statsRes.value ?? null;
  }
  return { games, stats, session };
};

const Home: Page<unknown, Params> = async ({ searchParams: { success } }) => {
  const data = await fetchHomeData();

  return (
    <Flex direction="column" h="100%" py="xl">
      {data.session != null ? (
        <HomeSection
          games={data.games}
          stats={data.stats}
          session={data.session}
        />
      ) : (
        <Landing />
      )}
      <SuccessNotification success={success} />
    </Flex>
  );
};

export default Home;
