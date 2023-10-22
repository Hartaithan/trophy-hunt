import API from "@/helpers/api";
import { type HeaderLink } from "@/models/LinkModel";
import { useProfiles } from "@/providers/ProfileProvider";
import {
  Container,
  Flex,
  Header as MantineHeader,
  Title,
  createStyles,
  UnstyledButton,
  Badge,
  Button,
  Menu,
  type MenuProps,
  Anchor,
} from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { type FC } from "react";
import { IconDoorExit, IconUser } from "@tabler/icons-react";

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

const MenuStyles: MenuProps["styles"] = ({ colors }) => ({
  dropdown: {
    background: colors.primary[8],
  },
});

const useStyles = createStyles(({ colors, spacing, radius, fontSizes }) => ({
  root: {
    width: "100%",
    minHeight: HEADER_HEIGHT,
    background: colors.primary[8],
  },
  container: {
    height: "100%",
    display: "flex",
    alignItems: "center",
  },
  links: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  link: {
    fontSize: fontSizes.sm,
    color: colors.secondary[8],
    fontWeight: 500,
    textDecoration: "none",
    padding: "2px 8px",
  },
  activeLink: {
    color: colors.accent[5],
    background: colors.accented[9] + "30",
    borderRadius: radius.sm,
  },
  disabledLink: {
    pointerEvents: "none",
    color: colors.secondary[2],
  },
  profile: {
    minWidth: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
}));

const Header: FC = () => {
  const { classes, cx } = useStyles();
  const { pathname, reload } = useRouter();
  const { psn, isAuth } = useProfiles();

  const handleSignOut = (): void => {
    API.get("/auth/signOut")
      .then(() => {
        reload();
      })
      .catch((error) => {
        console.error("unable to sign out", error);
      });
  };

  return (
    <MantineHeader className={classes.root} height={HEADER_HEIGHT} zIndex={100}>
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
                className={cx(
                  classes.link,
                  link.disabled && classes.disabledLink,
                  isActive && classes.activeLink
                )}
              >
                {link.label}
              </Anchor>
            );
          })}
        </Flex>
        {isAuth && (
          <Menu width={150} position="bottom-end" styles={MenuStyles}>
            <Menu.Target>
              <UnstyledButton className={classes.profile}>
                <Badge mr="sm" radius="sm">
                  {psn?.onlineId ?? "[Not Found]"}
                </Badge>
                <Image
                  width={30}
                  height={30}
                  src={psn?.avatarUrls[0].avatarUrl ?? ""}
                  alt="avatar"
                />
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                component={Link}
                prefetch={false}
                href="/profile"
                icon={<IconUser size="1rem" />}
                lh="initial"
              >
                Profile
              </Menu.Item>
              <Menu.Item
                onClick={() => handleSignOut()}
                icon={<IconDoorExit size="1rem" />}
              >
                Sign out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
        {!isAuth && (
          <Button
            component={Link}
            prefetch={false}
            href="/signIn"
            size="xs"
            leftIcon={<IconUser size="0.75rem" />}
            variant="light"
            compact
          >
            Sign in
          </Button>
        )}
      </Container>
    </MantineHeader>
  );
};

export default Header;
