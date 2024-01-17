import { type Game } from "@/models/GameModel";
import { Flex, Group, Title } from "@mantine/core";
import { type Session } from "@supabase/supabase-js";
import { Fragment, type FC } from "react";
import BoardLinkCard from "../BoardLinkCard/BoardLinkCard";
import classes from "./HomeSection.module.css";
import { type BoardStats } from "@/models/BoardModel";
import BoardStatsSection from "../BoardStatsSection/BoardStatsSection";

interface Props {
  games: Game[];
  stats: BoardStats | null;
  session: Session;
}

const HomeSection: FC<Props> = (props) => {
  const { games, stats } = props;
  return (
    <Flex className={classes.container} direction="column">
      {games.length > 0 && (
        <Fragment>
          <Title className={classes.title}>Recent updated</Title>
          <Group className={classes.list}>
            {games.map((item) => (
              <BoardLinkCard
                key={item.id}
                item={item}
                className={classes.card}
              />
            ))}
          </Group>
        </Fragment>
      )}
      <BoardStatsSection stats={stats} />
    </Flex>
  );
};

export default HomeSection;
