import { type IHeaderLink } from "@/models/LinkModel";
import {
  Container,
  Flex,
  Header as MantineHeader,
  Title,
  createStyles,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { type FC } from "react";

const HEADER_HEIGHT = 64;

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

const useStyles = createStyles(({ colors, spacing, radius }) => ({
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
  const { pathname } = useRouter();

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
        <Flex className={classes.profile}>Profile</Flex>
      </Container>
    </MantineHeader>
  );
};

export default Header;
