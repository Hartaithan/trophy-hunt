"use client";

import { type ForgotBody } from "@/models/AuthModel";
import API from "@/utils/api";
import {
  Anchor,
  Box,
  Button,
  Center,
  Flex,
  Group,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconArrowLeft, IconMailCheck } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState, type FC, Fragment } from "react";

const ForgotForm: FC = () => {
  const { back } = useRouter();
  const [sended, setSended] = useState(false);
  const form = useForm<ForgotBody>({
    initialValues: {
      email: "",
    },
    validate: {
      email: isEmail("Invalid email"),
    },
    validateInputOnChange: true,
  });

  const handleSubmit = (values: typeof form.values): void => {
    API.post("/auth/forgot", values)
      .then(({ data }) => {
        notifications.show({
          title: "Success!",
          message: data.message,
          autoClose: 3000,
        });
        setSended(true);
      })
      .catch((error) => {
        notifications.show({
          title: "Something went wrong!",
          color: "red",
          message: error.response.data.message,
          autoClose: false,
        });
        console.error("forgot request form error", error);
      });
  };

  if (sended) {
    return (
      <Flex direction="column" justify="center" align="center" ta="center">
        <IconMailCheck size={64} />
        <Title order={2} ta="center" mt="md" mb="sm">
          Check your email
        </Title>
        <Text ta="center" w="100%" maw={400} mb="lg">
          {form.values.email.trim().length > 0
            ? `We send password reset link to ${form.values.email}. `
            : "We send password reset link to your email. "}
          Please follow the instructions.
        </Text>
        <Anchor
          c="dimmed"
          onClick={() => {
            back();
          }}
          size="sm">
          <Center inline>
            <IconArrowLeft width={12} height={12} stroke={1.5} />
            <Box ml={5}>Back</Box>
          </Center>
        </Anchor>
      </Flex>
    );
  }

  return (
    <Fragment>
      <Title order={2} ta="center" mb="xs">
        Reset your password
      </Title>
      <Text ta="center" c="dimmed" size="sm" w="100%" maw={400} mb="md">
        Enter the email and we’ll send an email with instructions to reset your
        password.
      </Text>
      <Box
        component="form"
        w="100%"
        maw={400}
        onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          required
          type="email"
          label="Email"
          placeholder="Enter your email"
          {...form.getInputProps("email")}
        />
        <Group justify="space-between" mt="lg">
          <Anchor
            c="dimmed"
            onClick={() => {
              back();
            }}
            size="sm">
            <Center inline>
              <IconArrowLeft width={12} height={12} stroke={1.5} />
              <Box ml={5}>Back</Box>
            </Center>
          </Anchor>
          <Button type="submit" disabled={!form.isValid()}>
            Submit
          </Button>
        </Group>
      </Box>
    </Fragment>
  );
};

export default ForgotForm;
