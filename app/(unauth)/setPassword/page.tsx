import SetPasswordForm from "@/forms/setPassword";
import { type Page } from "@/models/AppModel";
import { Flex, Title } from "@mantine/core";
import classes from "../../../styles/Form.module.css";

const SetPasswordPage: Page = () => {
  return (
    <Flex
      h="100%"
      direction="column"
      justify="center"
      align="center"
      py={{ base: "md", md: "xl" }}>
      <Title className={classes.heading} order={2} ta="center" mb="md">
        Create new password
      </Title>
      <SetPasswordForm />
    </Flex>
  );
};

export default SetPasswordPage;
