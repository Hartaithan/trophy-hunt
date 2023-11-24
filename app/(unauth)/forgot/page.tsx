import ForgotForm from "@/forms/forgot";
import { Flex } from "@mantine/core";
import { type FC } from "react";

const ForgotPage: FC = () => {
  return (
    <Flex h="100%" direction="column" justify="center" align="center">
      <ForgotForm />
    </Flex>
  );
};

export default ForgotPage;
