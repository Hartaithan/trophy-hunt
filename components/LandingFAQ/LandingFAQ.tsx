"use client";

import { Accordion, Box, Title } from "@mantine/core";
import { type FC } from "react";

const LandingFAQ: FC = () => {
  return (
    <Box my="xl">
      <Title ta="center" my="xl">
        Frequently Asked Questions
      </Title>
      <Accordion variant="separated">
        <Accordion.Item value="first-question">
          <Accordion.Control>First question</Accordion.Control>
          <Accordion.Panel>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
            quidem, eius enim deserunt tempore mollitia tenetur reprehenderit
            error veniam. Illo omnis nulla alias ullam non dolor facilis at?
            Eius, provident.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="second-question">
          <Accordion.Control>Second question</Accordion.Control>
          <Accordion.Panel>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
            quidem, eius enim deserunt tempore mollitia tenetur reprehenderit
            error veniam. Illo omnis nulla alias ullam non dolor facilis at?
            Eius, provident.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="third-question">
          <Accordion.Control>Third question</Accordion.Control>
          <Accordion.Panel>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
            quidem, eius enim deserunt tempore mollitia tenetur reprehenderit
            error veniam. Illo omnis nulla alias ullam non dolor facilis at?
            Eius, provident.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Box>
  );
};

export default LandingFAQ;
