"use client";

import { type HeaderLink } from "@/models/LinkModel";
import { useMemo, type FC, useCallback, Fragment } from "react";
import {
  Anchor,
  Badge,
  Box,
  Burger,
  Button,
  Container,
  Divider,
  Flex,
  Menu,
  Paper,
  Title,
  Transition,
  UnstyledButton,
} from "@mantine/core";
import Image from "../Image/Image";
import Link from "../Link/Link";
import { IconDoorExit, IconUser } from "@tabler/icons-react";
import API from "@/utils/api";
import { usePathname, useRouter } from "next/navigation";
import classes from "./Header.module.css";
import clsx from "clsx";
import { type NullablePSNProfile } from "@/models/AuthModel";
import { useDisclosure } from "@mantine/hooks";

interface HeaderProps {
  profile?: NullablePSNProfile;
}

const HEADER_HEIGHT = 48;

const items: HeaderLink[] = [
  {
    id: 1,
    label: "Home",
    href: "/",
    disabled: false,
  },
  {
    id: 2,
    label: "Board",
    href: "/board",
    disabled: false,
  },
];

const Header: FC<HeaderProps> = (props) => {
  const { profile = null } = props;
  const pathname = usePathname();
  const { refresh } = useRouter();
  const [opened, { toggle }] = useDisclosure(false);

  const handleSignOut = useCallback((): void => {
    if (profile == null) return;
    API.get("/auth/signOut")
      .then(() => {
        refresh();
      })
      .catch((error) => {
        console.error("unable to sign out", error);
      });
  }, [profile, refresh]);

  const links = useMemo(
    () =>
      items.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Anchor
            size="sm"
            component={Link}
            key={link.id}
            href={link.href}
            className={clsx(
              classes.link,
              link.disabled && classes.disabledLink,
              isActive && classes.activeLink,
            )}>
            {link.label}
          </Anchor>
        );
      }),
    [pathname],
  );

  return (
    <Flex className={classes.root} mih={HEADER_HEIGHT}>
      <Container className={classes.container}>
        <Title order={4}>Trophy Hunt</Title>
        <Flex className={classes.links} visibleFrom="xs">
          {links}
        </Flex>
        <Box visibleFrom="xs">
          {profile != null ? (
            <Menu width={150} position="bottom-end">
              <Menu.Target>
                <UnstyledButton className={classes.profile}>
                  <Badge mr="sm" radius="sm">
                    {profile?.onlineId ?? "[Not Found]"}
                  </Badge>
                  <Image
                    width={30}
                    height={30}
                    src={
                      profile?.avatarUrls?.length > 0
                        ? profile.avatarUrls[0].avatarUrl
                        : ""
                    }
                    alt="avatar"
                  />
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  component={Link}
                  href="/profile"
                  rightSection={<IconUser size="1rem" />}
                  lh="initial">
                  Profile
                </Menu.Item>
                <Menu.Item
                  onClick={handleSignOut}
                  rightSection={<IconDoorExit size="1rem" />}>
                  Sign out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Button
              component={Link}
              href="/signIn"
              size="compact-xs"
              leftSection={<IconUser size="0.75rem" />}
              variant="light">
              Sign in
            </Button>
          )}
        </Box>
        <Flex ml="auto">
          {profile != null && (
            <Flex align="center" hiddenFrom="xs">
              <Badge mr="sm" radius="sm">
                {profile?.onlineId ?? "[Not Found]"}
              </Badge>
              <Image
                width={30}
                height={30}
                src={
                  profile?.avatarUrls?.length > 0
                    ? profile.avatarUrls[0].avatarUrl
                    : ""
                }
                alt="avatar"
              />
            </Flex>
          )}
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="xs"
            ml="xs"
            size="sm"
          />
        </Flex>
        <Transition transition="slide-down" duration={200} mounted={opened}>
          {(styles) => (
            <Paper
              className={classes.dropdown}
              hiddenFrom="xs"
              style={{
                ...styles,
                transform: styles.transform + " translateX(-50%)",
                top: HEADER_HEIGHT + 12,
              }}>
              {links}
              <Divider my={6} />
              {profile != null ? (
                <Fragment>
                  <Anchor
                    className={classes.link}
                    component={Link}
                    href="/profile"
                    lh="initial">
                    Profile
                  </Anchor>
                  <Anchor
                    className={classes.link}
                    component="button"
                    onClick={handleSignOut}>
                    Sign out
                  </Anchor>
                </Fragment>
              ) : (
                <Anchor
                  className={classes.link}
                  component={Link}
                  href="/profile">
                  Sign in
                </Anchor>
              )}
            </Paper>
          )}
        </Transition>
      </Container>
    </Flex>
  );
};

export default Header;
