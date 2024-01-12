import ProfileBlock from "@/components/ProfileBlock/ProfileBlock";
import ShareBoard from "@/components/ShareBoard/ShareBoard";
import TrophiesStats from "@/components/TrophiesStats/TrophiesStats";
import { type Page } from "@/models/AppModel";
import {
  type NullableProfile,
  type NullablePSNProfile,
} from "@/models/AuthModel";
import { API_URL } from "@/constants/api";
import { getRefreshedCookies } from "@/utils/cookies";
import { Button, Flex, Group, Stack, Title } from "@mantine/core";
import Link from "@/components/Link/Link";

interface Response {
  psn: NullablePSNProfile;
  profile: NullableProfile;
}

const getProfiles = async (): Promise<Response> => {
  let psn: NullablePSNProfile = null;
  let profile: NullableProfile = null;
  try {
    const cookies = getRefreshedCookies();
    const [psnRes, profileRes] = await Promise.allSettled([
      fetch(API_URL + "/profile/psn", {
        cache: "force-cache",
        headers: {
          Cookie: cookies,
        },
      }).then(async (res) => await res.json()),
      fetch(API_URL + "/profile", {
        headers: {
          Cookie: cookies,
        },
      }).then(async (res) => await res.json()),
    ]);
    if (psnRes.status === "fulfilled") {
      psn = psnRes.value?.profile ?? null;
    }
    if (profileRes.status === "fulfilled") {
      profile = profileRes.value?.profile ?? null;
    }
    return { psn, profile };
  } catch (error) {
    console.error("unable to fetch profiles", error);
    return { psn: null, profile: null };
  }
};

const ProfilePage: Page = async () => {
  const { psn, profile } = await getProfiles();

  return (
    <Flex direction="column" py={{ base: "lg", md: "xl" }}>
      <Flex mb="md" justify="space-between">
        <Title order={3}>Profile</Title>
        <Group>
          <Button component={Link} href="/profile/edit" radius="md">
            Edit Profile
          </Button>
        </Group>
      </Flex>
      <Stack>
        <ShareBoard profile={profile} />
        <ProfileBlock psn={psn} profile={profile} />
        <TrophiesStats psn={psn} />
      </Stack>
    </Flex>
  );
};

export default ProfilePage;
