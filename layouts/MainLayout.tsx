import { Container } from "@mantine/core";
import Head from "next/head";
import { type PropsWithChildren, type FC } from "react";

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Trophy Hunt</title>
        <meta name="description" content="Trophy Hunt" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container w="100%" h="100%">
        {children}
      </Container>
    </>
  );
};

export default MainLayout;
