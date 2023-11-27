import SignInForm from "@/forms/signIn";
import { type Page } from "@/models/AppModel";
import { Anchor, Flex, Text, Title } from "@mantine/core";
import Link from "next/link";

const SignInPage: Page = () => {
  return (
    <Flex h="100%" direction="column" justify="center" align="center">
      <Title order={2} ta="center" mb="md">
        Welcome back!
      </Title>
      <SignInForm />
      <Text ta="center" mt="xl" fw={500} size="sm">
        Don&apos;t have an account?&nbsp;
        <Anchor component={Link} prefetch={false} href="/signUp" td="underline">
          Sign Up!
        </Anchor>
      </Text>
    </Flex>
  );
};

export default SignInPage;
