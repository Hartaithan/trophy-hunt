"use client";

import { type FC } from "react";
import classes from "./NotFound.module.css";
import { Button, Flex, Title, Text } from "@mantine/core";
import { IconError404 } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

const NotFound: FC = () => {
  const { back } = useRouter();
  return (
    <Flex className={classes.container}>
      <IconError404 size={256} />
      <Flex className={classes.content}>
        <Title>Page Not Found</Title>
        <Text>This page doesn&apos;t exist</Text>
      </Flex>
      <Button mt="xl" radius="xl" onClick={back}>
        Go back
      </Button>
    </Flex>
  );
};

export default NotFound;
