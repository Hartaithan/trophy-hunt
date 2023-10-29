import SignUpForm from "@/forms/signUp";
import { Flex } from "@mantine/core";
import { type NextPage } from "next";

const SignUpPage: NextPage = () => {
  return (
    <Flex h="100%" direction="column" justify="center" align="center">
      <SignUpForm />
    </Flex>
  );
};

export default SignUpPage;
