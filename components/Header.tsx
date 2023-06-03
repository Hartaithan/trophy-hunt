import API from "@/helpers/api";
import { type IHeaderLink } from "@/models/LinkModel";
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
} from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { type FC } from "react";
import { DoorExit, User } from "tabler-icons-react";

const HEADER_HEIGHT = 48;

const links: IHeaderLink[] = [
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
    <MantineHeader className={classes.root} height={HEADER_HEIGHT}>
      <Container className={classes.container}>
        <Title order={4}>Trophy Hunt</Title>
        <Flex className={classes.links}>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.id}
                href={link.href}
                prefetch={false}
                className={cx(
                  classes.link,
                  link.disabled && classes.disabledLink,
                  isActive && classes.activeLink
                )}
              >
                {link.label}
              </Link>
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
              <Menu.Item icon={<User size="1rem" />}>
                <Link href="/profile">Profile</Link>
              </Menu.Item>
              <Menu.Item
                onClick={() => handleSignOut()}
                icon={<DoorExit size="1rem" />}
              >
                Sign out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
        {!isAuth && (
          <Link href="/signIn">
            <Button
              size="xs"
              leftIcon={<User size="0.75rem" />}
              variant="light"
              compact
            >
              Sign in
            </Button>
          </Link>
        )}
      </Container>
    </MantineHeader>
  );
};

export default Header;
