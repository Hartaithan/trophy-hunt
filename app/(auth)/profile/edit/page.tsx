import Link from "@/components/Link/Link";
import EditProfileForm from "@/forms/editProfile";
import { type NullableProfile } from "@/models/AuthModel";
import { API_URL } from "@/constants/api";
import { getRefreshedCookies } from "@/utils/cookies";
import { Button, Flex, Group, Title } from "@mantine/core";
import { type FC } from "react";
import classes from "../../../../styles/Form.module.css";

const getProfile = async (): Promise<NullableProfile> => {
  try {
    const cookies = getRefreshedCookies();
    const response = await fetch(API_URL + "/profile", {
      headers: {
        Cookie: cookies,
      },
    });
    const data = await response.json();
    if (!response.ok) throw Error();
    const profile: NullableProfile = data != null ? data.profile : null;
    return profile;
  } catch (error) {
    console.error("unable to fetch profile", error);
    return null;
  }
};

const EditProfilePage: FC = async () => {
  const profile = await getProfile();
  return (
    <Flex direction="column" py={{ base: "lg", md: "xl" }}>
      <Group justify="space-between" mb="md">
        <Title className={classes.heading} order={3}>
          Edit Profile
        </Title>
        <Button
          className={classes.button}
          component={Link}
          href="/profile/edit/password">
          Update Password
        </Button>
      </Group>
      <EditProfileForm profile={profile} />
    </Flex>
  );
};

export default EditProfilePage;
