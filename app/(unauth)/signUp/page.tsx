import SignUpForm from "@/forms/signUp";
import { type Page } from "@/models/AppModel";
import { Flex } from "@mantine/core";

const SignUpPage: Page = () => {
  return (
    <Flex
      h="100%"
      direction="column"
      justify="center"
      align="center"
      py={{ base: "md", md: "xl" }}>
      <SignUpForm />
    </Flex>
  );
};

export default SignUpPage;
