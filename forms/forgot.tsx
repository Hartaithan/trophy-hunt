"use client";

import { type ForgotBody } from "@/models/AuthModel";
import API from "@/utils/api";
import { Anchor, Box, Button, Center, Group, TextInput } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { type FC } from "react";

const ForgotForm: FC = () => {
  const router = useRouter();
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

  return (
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
            router.back();
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
  );
};

export default ForgotForm;
