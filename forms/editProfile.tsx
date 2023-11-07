"use client";

import { locales } from "@/constants/locales";
import { profileTypeOptions } from "@/constants/options";
import { type NullableProfile, type ProfileEditBody } from "@/models/AuthModel";
import API from "@/utils/api";
import { Box, Button, Flex, Grid, Input, Select } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { type FC } from "react";

interface Props {
  profile: NullableProfile;
}

const EditProfileForm: FC<Props> = (props) => {
  const { profile } = props;

  const form = useForm<ProfileEditBody>({
    initialValues: {
      language: profile?.language ?? "en-US",
      type: profile?.type ?? "public",
    },
    validate: {
      language: isNotEmpty("Language is required"),
    },
    validateInputOnChange: ["username"],
  });

  const handleSubmit = (values: typeof form.values): void => {
    API.put("/profile", JSON.stringify(values))
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
        console.error("edit profile error", error);
      });
  };

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
      <Grid>
        <Grid.Col span={6}>
          <Input.Wrapper id="username" withAsterisk>
            <Flex justify="space-between" align="flex-end">
              <Input.Label>Username</Input.Label>
              <Input.Label size="xs">Non-editable</Input.Label>
            </Flex>
            <Input
              id="username"
              readOnly
              disabled
              placeholder="Your username"
              value={profile?.username ?? "Username not found"}
            />
          </Input.Wrapper>
        </Grid.Col>
        <Grid.Col span={6}>
          <Input.Wrapper id="created" withAsterisk>
            <Flex justify="space-between" align="flex-end">
              <Input.Label>Profile creation date</Input.Label>
              <Input.Label size="xs">Non-editable</Input.Label>
            </Flex>
            <Input
              id="created"
              readOnly
              disabled
              placeholder="Profile creation date"
              value={
                profile != null
                  ? new Date(profile.created_at).toLocaleString()
                  : "Created date not found"
              }
            />
          </Input.Wrapper>
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="Language"
            data={locales}
            value={form.values.language}
            onChange={(value) => {
              form.setFieldValue("language", value ?? "en-US");
            }}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            data={profileTypeOptions}
            label="Profile type"
            placeholder="Pick profile type"
            {...form.getInputProps("type")}
          />
        </Grid.Col>
      </Grid>
      <Flex justify="flex-end">
        <Button
          type="submit"
          w={150}
          mt="xl"
          disabled={!form.isDirty() && form.isValid()}>
          Update!
        </Button>
      </Flex>
    </Box>
  );
};

export default EditProfileForm;
