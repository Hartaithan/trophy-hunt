"use client";

import { type HeaderLink } from "@/models/LinkModel";
import { type FC } from "react";
import {
  Anchor,
  Badge,
  Button,
  Container,
  Flex,
  Menu,
  Title,
  UnstyledButton,
} from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { IconDoorExit, IconUser } from "@tabler/icons-react";
import API from "@/utils/api";
import { usePathname, useRouter } from "next/navigation";
import classes from "./Header.module.css";
import clsx from "clsx";
import { type NullablePSNProfile } from "@/models/AuthModel";

interface HeaderProps {
  profile?: NullablePSNProfile;
}

const HEADER_HEIGHT = 48;

const links: HeaderLink[] = [
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
  {
    id: 3,
    label: "About",
    href: "/about",
    disabled: true,
  },
];

const Header: FC<HeaderProps> = (props) => {
  const { profile = null } = props;
  const pathname = usePathname();
  const { refresh } = useRouter();

  const handleSignOut = (): void => {
    if (profile == null) return;
    API.get("/auth/signOut")
      .then(() => {
        refresh();
      })
      .catch((error) => {
        console.error("unable to sign out", error);
      });
  };

  return (
    <Flex className={classes.root} mih={HEADER_HEIGHT}>
      <Container className={classes.container}>
        <Title order={4}>Trophy Hunt</Title>
        <Flex className={classes.links}>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Anchor
                size="sm"
                component={Link}
                prefetch={false}
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
          })}
        </Flex>
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
                  unoptimized
                />
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                component={Link}
                prefetch={false}
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
            prefetch={false}
            href="/signIn"
            size="compact-xs"
            leftSection={<IconUser size="0.75rem" />}
            variant="light">
            Sign in
          </Button>
        )}
      </Container>
    </Flex>
  );
};

export default Header;
