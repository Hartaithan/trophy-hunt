import SignInForm from "@/forms/signIn/form";
import { Anchor, Text, Title } from "@mantine/core";
import { type NextPage } from "next";
import Link from "next/link";
import { Fragment } from "react";

const SignInPage: NextPage = () => {
  return (
    <Fragment>
      <Title order={2} ta="center" mb="md">
        Welcome back!
      </Title>
      <SignInForm />
      <Text ta="center" mt="xl" fw={500} size="sm">
        Don&apos;t have an account?&nbsp;
        <Anchor
          component={Link}
          prefetch={false}
          href="/auth/signUp"
          td="underline">
          Sign Up!
        </Anchor>
      </Text>
    </Fragment>
  );
};

export default SignInPage;
