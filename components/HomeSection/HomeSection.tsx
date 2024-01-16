import { type Game } from "@/models/GameModel";
import { Flex, Group, Text, Title } from "@mantine/core";
import { type Session } from "@supabase/supabase-js";
import { Fragment, type FC } from "react";
import BoardLinkCard from "../BoardLinkCard/BoardLinkCard";
import classes from "./HomeSection.module.css";
import { type BoardStats } from "@/models/BoardModel";

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
      <Text component="pre" size="xs" mt="md">
        {JSON.stringify(stats, null, 2)}
      </Text>
    </Flex>
  );
};

export default HomeSection;
