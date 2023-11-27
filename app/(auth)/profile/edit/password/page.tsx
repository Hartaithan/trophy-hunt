import ChangePasswordForm from "@/forms/changePassword";
import { type Page } from "@/models/AppModel";
import { Flex, Title } from "@mantine/core";

const ChangePasswordPage: Page = () => {
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
