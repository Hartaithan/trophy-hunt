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
import classes from "./LandingFAQ.module.css";

const LandingFAQ: FC = () => {
  return (
    <Flex direction="column" align="center" my="xl">
      <Title className={classes.title} ta="center" my="xl">
        Frequently Asked Questions
      </Title>
      <Box className={classes.wrapper}>
        <Accordion variant="separated" radius="md" classNames={classes}>
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
              Our service is communicating with the PSN API, for which we ask
              you to enter the NPSSO authorization token. Access to your PSN
              account is used to get profile data, progress and trophy
              statistics.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="npsso">
            <AccordionControl>What is NPSSO?</AccordionControl>
            <AccordionPanel>
              NPSSO is an authorization token required to work with the PSN API.
              Without it, it is impossible to get trophy data and synchronize
              your progress.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="security">
            <AccordionControl>
              I&apos;m still afraid my data will be stolen. How can you convince
              me it&apos;s safe?
            </AccordionControl>
            <AccordionPanel>
              I mean, I don&apos;t think I have the power to convince anyone
              that the app is safe. But if you have concerns, you can always
              make a fake PSN account, try the service and if everything is
              fine, sign up again with your main account.
              <br />
              <br />
              And also, to protect your account from unauthorized access, we
              recommend that you enable&nbsp;
              <Anchor
                href="https://www.playstation.com/en-us/playstation-network/two-step-verification/"
                target="_blank">
                2FA
              </Anchor>
              &nbsp;on your PSN account. This will provide you with an
              additional layer of security.
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
