import ChangePasswordForm from "@/forms/changePassword";
import { type Page } from "@/models/AppModel";
import { Flex, Title } from "@mantine/core";
import classes from "../../../../../styles/Form.module.css";

const ChangePasswordPage: Page = () => {
  return (
    <Flex direction="column" py={{ base: "lg", md: "xl" }}>
      <Title className={classes.heading} order={3} mb="md">
        Change Password
      </Title>
      <ChangePasswordForm />
    </Flex>
  );
};

export default ChangePasswordPage;
