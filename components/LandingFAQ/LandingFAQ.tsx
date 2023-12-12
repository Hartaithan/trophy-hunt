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
          <AccordionControl>Is it free?</AccordionControl>
          <AccordionPanel>
            Yes, it is completely free. Moreover, we do not have any ads. Use
            our service without any limitations!
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="second-question">
          <AccordionControl>
            How does the authorization process work?
          </AccordionControl>
          <AccordionPanel>
            Our service synchronizes with PSN API, so we ask you to enter your
            NPSSO authorization token to be able to work with it. In addition,
            we also authorize users in our service, so that we can store data
            about your progress.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="third-question">
          <AccordionControl>What is NPSSO?</AccordionControl>
          <AccordionPanel>
            NPSSO is an authorization token that is required to work with PSN
            API. Without it, it would not be possible to synchronize your
            progress and trophies.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default LandingFAQ;
