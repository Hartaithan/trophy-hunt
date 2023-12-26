import { Box, Flex, Text } from "@mantine/core";
import { type FC } from "react";
import classes from "./ProfileBlock.module.css";
import Image from "../Image/Image";
import {
  type NullableProfile,
  type NullablePSNProfile,
} from "@/models/AuthModel";
import { getName, getPresence } from "@/utils/profile";
import { capitalize } from "@/utils/string";
import { locales } from "@/constants/locales";
import PlusBadge from "../PlusBadge/PlusBadge";

interface ProfileBlockProps {
  psn: NullablePSNProfile;
  profile: NullableProfile;
}

const ProfileBlock: FC<ProfileBlockProps> = (props) => {
  const { psn, profile } = props;

  const name = getName(psn);
  const presence = getPresence(psn);

  return (
    <Flex className={classes.container}>
      <Image
        className={classes.avatar}
        height={100}
        width={100}
        src={psn?.avatarUrls[0].avatarUrl ?? ""}
        alt="avatar"
      />
      <Flex className={classes.psn}>
        <Flex align="center">
          <Text fz="xl" fw={700}>
            {name}
          </Text>
          {psn?.plus === 1 && <PlusBadge ml="sm" />}
        </Flex>
        <Flex gap="sm">
          <Text fw={600}>{psn?.onlineId ?? "PSN ID Not Found"}</Text>
          {presence != null && <Text c="dimmed">{presence}</Text>}
        </Flex>
        {psn?.aboutMe != null && psn.aboutMe.trim().length > 0 && (
          <Text mt="sm">{psn.aboutMe}</Text>
        )}
      </Flex>
      <Flex className={classes.profile}>
        {profile?.username != null && (
          <Box>
            <Text>Username</Text>
            <Text className={classes.profileValue}>{profile.username}</Text>
          </Box>
        )}
        {profile?.type != null && (
          <Box ml={{ base: 0, sm: 64 }}>
            <Text>Profile Type</Text>
            <Text className={classes.profileValue}>
              {capitalize(profile.type)}
            </Text>
          </Box>
        )}
        {profile?.language != null && (
          <Box ml={{ base: 0, sm: 64 }}>
            <Text>Language</Text>
            <Text className={classes.profileValue}>
              {locales.find((i) => i.value === profile.language)?.label ??
                "[Not Found]"}
            </Text>
          </Box>
        )}
      </Flex>
    </Flex>
  );
};

export default ProfileBlock;
