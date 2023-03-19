import { type IPage } from "@/models/AppModel";
import { Flex, Title } from "@mantine/core";

const Home: IPage = () => {
  return (
    <Flex h="100%" justify="center" align="center">
      <Title>Hello world!</Title>
    </Flex>
  );
};

export default Home;
