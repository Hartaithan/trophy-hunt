import SetPasswordForm from "@/forms/setPassword";
import { Flex, Title } from "@mantine/core";
import { type NextPage } from "next";

const SetPasswordPage: NextPage = () => {
  return (
    <Flex h="100%" direction="column" justify="center" align="center">
      <Title order={2} ta="center" mb="md">
        Create new password
      </Title>
      <SetPasswordForm />
    </Flex>
  );
};

export default SetPasswordPage;
