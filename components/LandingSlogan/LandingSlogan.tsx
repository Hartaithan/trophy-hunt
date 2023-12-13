import { type FC } from "react";
import classes from "./LandingSlogan.module.css";
import { Flex, Text } from "@mantine/core";
import { slogan } from "@/constants/landing";
import clsx from "clsx";

const LandingSlogan: FC = () => {
  return (
    <Flex className={classes.container}>
      <Flex fw={600} className={clsx(classes.slider, classes.sliderTitle)}>
        {slogan.map((item) => (
          <Text
            key={"title" + item.title}
            variant="gradient"
            gradient={item.gradient}>
            {item.title}
          </Text>
        ))}
      </Flex>
      <Text
        fw={500}
        className={classes.caption}
        variant="gradient"
        gradient={{ from: "#c8d1d8", to: "#eef2f3", deg: 45 }}>
        your
      </Text>
      <Flex fw={600} className={clsx(classes.slider, classes.sliderTarget)}>
        {slogan.map((item) => (
          <Text
            key={"target" + item.target}
            variant="gradient"
            gradient={item.gradient}>
            {item.target}!
          </Text>
        ))}
      </Flex>
    </Flex>
  );
};

export default LandingSlogan;
