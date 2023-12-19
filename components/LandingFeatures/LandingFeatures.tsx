import { slogan } from "@/constants/landing";
import { Text, Flex, Grid, GridCol } from "@mantine/core";
import { type FC } from "react";
import Image from "../Image/Image";
import classes from "./LandingFeatures.module.css";

const HEIGHT = { base: 200, sm: 250, md: 300 };

const LandingFeatures: FC = () => {
  return (
    <Grid w="100%" gutter="xl" mt="xl">
      <GridCol order={1} span={{ base: 12, md: 6 }}>
        <Flex h={HEIGHT} className={classes.wrapper}>
          <Image
            fill
            className={classes.illustration}
            src="/landing/backlog.webp"
            alt="backlog landing illustration"
          />
        </Flex>
      </GridCol>
      <GridCol order={2} span={{ base: 12, md: 6 }}>
        <Flex className={classes.content}>
          <Text
            className={classes.heading}
            ta={{ base: "center", md: "start" }}
            mb="xs"
            variant="gradient"
            gradient={slogan[0].gradient}>
            Backlog planning
          </Text>
          <Text
            className={classes.description}
            ta={{ base: "center", md: "start" }}>
            Plan your backlog with ease! You can use a handy search to find the
            exact game you want. You can also add games to your list, arrange
            them by priority, and mark them as in progress when you start
            playing.
          </Text>
        </Flex>
      </GridCol>
      <GridCol order={{ base: 4, md: 3 }} span={{ base: 12, md: 6 }}>
        <Flex className={classes.content}>
          <Text
            className={classes.heading}
            ta={{ base: "center", md: "end" }}
            mb="xs"
            variant="gradient"
            gradient={slogan[1].gradient}>
            Tracking trophies
          </Text>
          <Text
            className={classes.description}
            ta={{ base: "center", md: "end" }}>
            Keep track of your progress towards platinum! You can see how many
            trophies you have earned in each game, what percentage of completion
            you have achieved, and how much more you need to do to get platinum!
          </Text>
        </Flex>
      </GridCol>
      <GridCol order={{ base: 3, md: 4 }} span={{ base: 12, md: 6 }}>
        <Flex h={HEIGHT} className={classes.wrapper}>
          <Image
            fill
            className={classes.illustration}
            src="/landing/trophies.webp"
            alt="trophies landing illustration"
          />
        </Flex>
      </GridCol>
      <GridCol order={5} span={{ base: 12, md: 6 }}>
        <Flex h={HEIGHT} className={classes.wrapper}>
          <Image
            fill
            className={classes.illustration}
            src="/landing/complete.webp"
            alt="complete landing illustration"
          />
        </Flex>
      </GridCol>
      <GridCol order={6} span={{ base: 12, md: 6 }}>
        <Flex className={classes.content}>
          <Text
            className={classes.heading}
            ta={{ base: "center", md: "start" }}
            mb="xs"
            variant="gradient"
            gradient={slogan[2].gradient}>
            Complete platinums
          </Text>
          <Text
            className={classes.description}
            ta={{ base: "center", md: "start" }}>
            Experience the thrill of hunting and the satisfaction of collecting
            platinums with a handy trophy tracking tool. You can also share your
            platinums with your friends and followers on social media and show
            off your skills.
          </Text>
        </Flex>
      </GridCol>
    </Grid>
  );
};

export default LandingFeatures;
