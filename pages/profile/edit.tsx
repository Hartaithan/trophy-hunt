import LanguageSelect from "@/components/LanguageSelect";
import { profileTypeOptions } from "@/constants/options";
import API from "@/helpers/api";
import { type IPage } from "@/models/AppModel";
import { type ProfileEditBody, type IProfile } from "@/models/AuthModel";
import { Box, Button, Flex, Grid, Input, Select, Title } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { type GetServerSideProps } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface IEditProfilePageProps {
  profile: IProfile | null;
  message?: string;
}

export const getServerSideProps: GetServerSideProps<
  IEditProfilePageProps
> = async (ctx) => {
  if (API_URL === undefined) {
    console.error("env variables not found");
    return { props: { profile: null, message: "Something wrong..." } };
  }

  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: ctx.req.headers.cookie ?? "",
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return {
      props: { profile: data.profile ?? null },
    };
  } catch (error) {
    console.error("unable to fetch profile", error);
    return {
      props: { profile: null, message: "Unable to fetch profile" },
    };
  }
};

const EditProfilePage: IPage<IEditProfilePageProps> = (props) => {
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
    if (API_URL == null) {
      console.error("API_URL not found");
      return;
    }
    API.put("/profile", JSON.stringify(values))
      .then((res) => {
        notifications.show({
          title: "Success!",
          message: res.data.message,
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
    <Flex direction="column" py="xl">
      <Title order={3} mb="md">
        Edit Profile
      </Title>
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
            <LanguageSelect
              value={form.values.language}
              onChange={(value) =>
                form.setFieldValue("language", value ?? "en-US")
              }
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
            disabled={!form.isDirty() && form.isValid()}
          >
            Update!
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default EditProfilePage;
