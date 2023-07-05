import Header from "@/components/Header";
import { Container, createStyles } from "@mantine/core";
import Head from "next/head";
import { type PropsWithChildren, type FC } from "react";

const useStyles = createStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    flex: "1 1 auto",
    "& > div": {
      flex: 1,
    },
  },
}));

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  const { classes } = useStyles();
  return (
    <>
      <Head>
        <title>Trophy Hunt</title>
        <meta name="description" content="Trophy Hunt" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div id="reward" />
      <Container className={classes.container}>{children}</Container>
    </>
  );
};

export default MainLayout;
