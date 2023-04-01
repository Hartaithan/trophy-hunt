import { type IPage } from "@/models/AppModel";
import { Flex, Title } from "@mantine/core";
import Link from "next/link";

const BoardPage: IPage = () => {
  return (
    <Flex h="100%" justify="center" align="center" direction="column">
      <Title>Board Page!</Title>
      <Link href="/" prefetch={false}>
        to /index
      </Link>
    </Flex>
  );
};

export default BoardPage;
