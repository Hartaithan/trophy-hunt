"use client";

import { slogan } from "@/constants/landing";
import { Text, Flex, Grid, Skeleton } from "@mantine/core";
import { type FC } from "react";

const HEIGHT = 300;

const LandingFeatures: FC = () => {
  return (
    <Grid w="100%" gutter="xl" mt="xl">
      <Grid.Col span={6}>
        <Skeleton height={HEIGHT} radius="md" animate={false} />
      </Grid.Col>
      <Grid.Col span={6}>
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
            quidem, eius enim deserunt tempore mollitia tenetur reprehenderit
            error veniam. Illo omnis nulla alias ullam non dolor facilis at?
            Eius, provident.
          </Text>
        </Flex>
      </Grid.Col>
      <Grid.Col span={6}>
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
            quidem, eius enim deserunt tempore mollitia tenetur reprehenderit
            error veniam. Illo omnis nulla alias ullam non dolor facilis at?
            Eius, provident.
          </Text>
        </Flex>
      </Grid.Col>
      <Grid.Col span={6}>
        <Skeleton height={HEIGHT} radius="md" animate={false} />
      </Grid.Col>
      <Grid.Col span={6}>
        <Skeleton height={HEIGHT} radius="md" animate={false} />
      </Grid.Col>
      <Grid.Col span={6}>
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
            quidem, eius enim deserunt tempore mollitia tenetur reprehenderit
            error veniam. Illo omnis nulla alias ullam non dolor facilis at?
            Eius, provident.
          </Text>
        </Flex>
      </Grid.Col>
    </Grid>
  );
};

export default LandingFeatures;
