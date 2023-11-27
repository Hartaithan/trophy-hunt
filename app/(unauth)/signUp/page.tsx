import SignUpForm from "@/forms/signUp";
import { type Page } from "@/models/AppModel";
import { Flex } from "@mantine/core";

const SignUpPage: Page = () => {
  return (
    <Flex h="100%" direction="column" justify="center" align="center">
      <SignUpForm />
    </Flex>
  );
};

export default SignUpPage;
