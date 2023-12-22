"use client";

import {
  Anchor,
  Drawer,
  Stack,
  type DrawerProps,
  Stepper,
  Flex,
  Alert,
} from "@mantine/core";
import { memo, type FC } from "react";
import classes from "./TutorialDrawer.module.css";
import { Text } from "@mantine/core";
import {
  IconAlertOctagon,
  IconChecks,
  IconTableShare,
  IconUserCheck,
} from "@tabler/icons-react";
import { theme } from "@/styles/theme";

const TutorialDrawer: FC<DrawerProps> = (props) => {
  const { ...rest } = props;
  return (
    <Drawer
      classNames={classes}
      title="How to get NPSSO?"
      position="right"
      size="lg"
      {...rest}>
      <Stack className={classes.explanation}>
        <Text size="sm">
          So, uh, okay. You probably don&apos;t understand what the fuck the
          NPSSO is, do you? I&apos;ll explain.
        </Text>
        <Text size="sm">
          PlayStation has a <b>private API</b>, and I can&apos;t just grab your
          trophy data whenever I want. So I have to access the PSN API with an
          authorization token, which is what <b>NPSSO</b> is. And the only way
          to get it is to authorize on the PSN Store website.
        </Text>
        <Text size="sm">
          And if you think it&apos;s a scam, okay, I feel you. But look at&nbsp;
          <Anchor
            href="https://www.reddit.com/r/Trophies/comments/phqhmu/other_is_there_a_way_to_get_access_token_to_use"
            target="_blank">
            this
          </Anchor>
          &nbsp;and
          <Anchor
            href="https://psn-api.achievements.app/authentication/authenticating-manually"
            target="_blank">
            &nbsp;this
          </Anchor>
          &nbsp;discussion. It&apos;s literally, <b>the only way</b> to
          communicate with the PSN API. There&apos;s nothing I can do about it.
          I wish it was more user friendly too, but alas, it&apos;s not possible
          at the moment.
        </Text>
      </Stack>
      <Flex className={classes.steps}>
        <Text size="lg" fw={500}>
          So, how do you get the NPSSO?
        </Text>
        <Stepper active={-1} orientation="vertical">
          <Stepper.Step
            icon={<IconUserCheck />}
            label="Step 1"
            description={
              <Text size="sm">
                Sign in on the&nbsp;
                <Anchor href="https://store.playstation.com" target="_blank">
                  PSN Store
                </Anchor>
              </Text>
            }
          />
          <Stepper.Step
            icon={<IconTableShare />}
            label="Step 2"
            description={
              <Text size="sm">
                Visit&nbsp;
                <Anchor
                  href="https://ca.account.sony.com/api/v1/ssocookie"
                  target="_blank">
                  this page
                </Anchor>
                &nbsp;to see your NPSSO token.
              </Text>
            }
          />
          <Stepper.Step
            icon={<IconChecks />}
            label="Step 3"
            description="Go back and fill the field"
          />
        </Stepper>
      </Flex>
      <Text size="lg" fw={500} mb="md">
        Known Issues
      </Text>
      <Alert
        variant="light"
        color="orange"
        title="Invalid Grant Error"
        radius="md"
        classNames={{
          root: classes.alertRoot,
          icon: classes.alertIcon,
        }}
        icon={
          <IconAlertOctagon
            color={
              theme.colors?.orange != null ? theme.colors.orange[0] : undefined
            }
          />
        }>
        If you get an &apos;invalid_grant&apos; error when you go to the&nbsp;
        <Anchor
          href="https://ca.account.sony.com/api/v1/ssocookie"
          target="_blank"
          size="sm">
          /ssocookie
        </Anchor>
        &nbsp;page, it means your login failed. You can try to clear your
        cookies and log in again.
      </Alert>
    </Drawer>
  );
};

export default memo(TutorialDrawer);
