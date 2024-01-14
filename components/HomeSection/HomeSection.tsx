import { type Game } from "@/models/GameModel";
import { Flex, Group, Title } from "@mantine/core";
import { type Session } from "@supabase/supabase-js";
import { Fragment, type FC } from "react";
import BoardLinkCard from "../BoardLinkCard/BoardLinkCard";
import classes from "./HomeSection.module.css";

interface Props {
  games: Game[];
  session: Session;
}

const HomeSection: FC<Props> = (props) => {
  const { games } = props;
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
    </Flex>
  );
};

export default HomeSection;
