import { slogan } from "@/constants/landing";
import { Text, Flex, Grid, GridCol, Skeleton } from "@mantine/core";
import { type FC } from "react";

const HEIGHT = 300;

const LandingFeatures: FC = () => {
  return (
    <Grid w="100%" gutter="xl" mt="xl">
      <GridCol span={6}>
        <Skeleton height={HEIGHT} radius="md" animate={false} />
      </GridCol>
      <GridCol span={6}>
        <Flex h="100%" direction="column" justify="center">
          <Text
            size="34px"
            lh="110%"
            fw="bold"
            mb="xs"
            variant="gradient"
            gradient={slogan[0].gradient}>
            Backlog planning
          </Text>
          <Text>
            Plan your backlog easily! There&apos;s a handy search to find the
            exact game you&apos;re looking for. Games can be added to the list,
            prioritized, and marked as in progress when playing.
          </Text>
        </Flex>
      </GridCol>
      <GridCol span={6}>
        <Flex h="100%" direction="column" justify="center">
          <Text
            size="34px"
            lh="110%"
            fw="bold"
            mb="xs"
            ta="end"
            variant="gradient"
            gradient={slogan[1].gradient}>
            Tracking trophies
          </Text>
          <Text ta="end">
            Track your progress on getting platinum! You can see how many
            trophies you&apos;ve already earned in each game, what level of
            completion you&apos;re currently at, and how much more you have left
            to get platinum!
          </Text>
        </Flex>
      </GridCol>
      <GridCol span={6}>
        <Skeleton height={HEIGHT} radius="md" animate={false} />
      </GridCol>
      <GridCol span={6}>
        <Skeleton height={HEIGHT} radius="md" animate={false} />
      </GridCol>
      <GridCol span={6}>
        <Flex h="100%" direction="column" justify="center">
          <Text
            size="34px"
            lh="110%"
            fw="bold"
            mb="xs"
            variant="gradient"
            gradient={slogan[2].gradient}>
            Complete platinums
          </Text>
          <Text>
            You can enjoy the thrill of hunting and the satisfaction of
            collecting platinums with a handy trophy tracking tool. You can also
            share your platinums with friends and followers on social networks
            and show off your passion.
          </Text>
        </Flex>
      </GridCol>
    </Grid>
  );
};

export default LandingFeatures;
