import { type FC } from "react";
import classes from "./LandingSlogan.module.css";
import { Flex, Text } from "@mantine/core";

const LandingSlogan: FC = () => {
  return (
    <Flex className={classes.container}>
      <Flex fw={600} className={classes.slider}>
        <Text>Plan</Text>
        <Text>Track</Text>
        <Text>Complete</Text>
      </Flex>
      <Text className={classes.caption}>your platinums!</Text>
    </Flex>
  );
};

export default LandingSlogan;
