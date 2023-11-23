import ForgotForm from "@/forms/forgot";
import { Flex, Title } from "@mantine/core";
import { type FC } from "react";

const ForgotPage: FC = () => {
  return (
    <Flex h="100%" direction="column" justify="center" align="center">
      <Title order={2} ta="center" mb="md">
        Reset your password
      </Title>
      <ForgotForm />
    </Flex>
  );
};

export default ForgotPage;
