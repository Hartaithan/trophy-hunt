import ChangePasswordForm from "@/forms/changePassword";
import { Flex, Title } from "@mantine/core";
import { type NextPage } from "next";

const ChangePasswordPage: NextPage = () => {
  return (
    <Flex direction="column" py="xl">
      <Title order={3} mb="md">
        Change Password
      </Title>
      <ChangePasswordForm />
    </Flex>
  );
};

export default ChangePasswordPage;
