import UpdatePasswordForm from "@/forms/updatePassword";
import { Flex, Title } from "@mantine/core";
import { type NextPage } from "next";

const UpdatePasswordPage: NextPage = () => {
  return (
    <Flex direction="column" py="xl">
      <Title order={3} mb="md">
        Update Password
      </Title>
      <UpdatePasswordForm />
    </Flex>
  );
};

export default UpdatePasswordPage;
