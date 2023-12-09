import { type FC } from "react";
import classes from "./LandingSlogan.module.css";
import { Flex, Text } from "@mantine/core";

const slides = [
  {
    title: "Plan",
    gradient: { from: "#11998e", to: "#38ef7d", deg: 45 },
  },
  {
    title: "Track",
    gradient: { from: "#0082c8", to: "#667db6", deg: 45 },
  },
  {
    title: "Complete",
    gradient: { from: "#e53935", to: "#e35d5b", deg: 45 },
  },
];

const LandingSlogan: FC = () => {
  return (
    <Flex className={classes.container}>
      <Flex fw={600} className={classes.slider}>
        {slides.map((item) => (
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
