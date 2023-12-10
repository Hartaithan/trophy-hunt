import { type FC } from "react";
import classes from "./LandingSlogan.module.css";
import { Flex, Text } from "@mantine/core";
import { slogan } from "@/constants/landing";

const LandingSlogan: FC = () => {
  return (
    <Flex className={classes.container}>
      <Flex fw={600} className={classes.slider}>
        {slogan.map((item) => (
          <Text key={item.title} variant="gradient" gradient={item.gradient}>
            {item.title}
          </Text>
        ))}
      </Flex>
      <Text
        fw={500}
        className={classes.caption}
        variant="gradient"
        gradient={{ from: "#c8d1d8", to: "#eef2f3", deg: 45 }}>
        your platinums!
      </Text>
    </Flex>
  );
};

export default LandingSlogan;
