import {
  Accordion,
  AccordionItem,
  AccordionControl,
  AccordionPanel,
  Box,
  Title,
} from "@mantine/core";
import { type FC } from "react";

const LandingFAQ: FC = () => {
  return (
    <Box my="xl">
      <Title ta="center" my="xl">
        Frequently Asked Questions
      </Title>
      <Accordion variant="separated">
        <AccordionItem value="first-question">
          <AccordionControl>First question</AccordionControl>
          <AccordionPanel>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
            quidem, eius enim deserunt tempore mollitia tenetur reprehenderit
            error veniam. Illo omnis nulla alias ullam non dolor facilis at?
            Eius, provident.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="second-question">
          <AccordionControl>Second question</AccordionControl>
          <AccordionPanel>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
            quidem, eius enim deserunt tempore mollitia tenetur reprehenderit
            error veniam. Illo omnis nulla alias ullam non dolor facilis at?
            Eius, provident.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="third-question">
          <AccordionControl>Third question</AccordionControl>
          <AccordionPanel>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
            quidem, eius enim deserunt tempore mollitia tenetur reprehenderit
            error veniam. Illo omnis nulla alias ullam non dolor facilis at?
            Eius, provident.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default LandingFAQ;
