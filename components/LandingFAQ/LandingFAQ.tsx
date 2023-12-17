import {
  Accordion,
  AccordionItem,
  AccordionControl,
  AccordionPanel,
  Box,
  Title,
  Flex,
  Anchor,
} from "@mantine/core";
import { type FC } from "react";

const LandingFAQ: FC = () => {
  return (
    <Flex direction="column" align="center" my="xl">
      <Title ta="center" my="xl">
        Frequently Asked Questions
      </Title>
      <Box w="70%">
        <Accordion variant="separated">
          <AccordionItem value="pricing">
            <AccordionControl>Does it cost anything?</AccordionControl>
            <AccordionPanel>
              No, it is completely free. Moreover, we do not have any ads. Use
              our service without any limitations!
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="authorization">
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
          <AccordionItem value="npsso">
            <AccordionControl>What is NPSSO?</AccordionControl>
            <AccordionPanel>
              NPSSO is an authorization token that is required to work with PSN
              API. Without it, it would not be possible to synchronize your
              progress and trophies.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="profile-type">
            <AccordionControl>What is a profile type?</AccordionControl>
            <AccordionPanel>
              A profile type is a setting that controls the visibility of your
              board. You can choose between public or private types. A public
              board can be viewed by anyone, while a private board is only
              visible to you.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="support">
            <AccordionControl>
              How do I contact support if I have problems or questions?
            </AccordionControl>
            <AccordionPanel>
              You can always email me at&nbsp;
              <Anchor href="mailto:hartaithan@gmail.com?subject=[Trophy Hunt]: Support">
                hartaithan@gmail.com
              </Anchor>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </Flex>
  );
};

export default LandingFAQ;
