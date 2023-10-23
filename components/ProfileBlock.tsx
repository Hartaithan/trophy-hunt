import { Flex, createStyles, Text, Box } from "@mantine/core";
import { type FC } from "react";
import ImageWithFallback from "./Image";
import { getName, getPresence } from "@/helpers/profile";
import PlusBadge from "./PlusBadge";
import { useProfiles } from "@/providers/ProfileProvider";
import { locales } from "@/constants/locales";
import { capitalize } from "@/helpers/string";

const useStyles = createStyles(({ spacing, colors, radius }) => ({
  container: {
    background: colors.primary[7],
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: "center",
  },
  avatar: {
    marginRight: spacing.md,
  },
}));

const ProfileBlock: FC = () => {
  const { psn, profile } = useProfiles();
  const { classes } = useStyles();

  const name = getName(psn);
  const presence = getPresence(psn);

  return (
    <Flex className={classes.container}>
      <ImageWithFallback
        className={classes.avatar}
        height={100}
        width={100}
        src={psn?.avatarUrls[0].avatarUrl ?? ""}
        alt="avatar"
        rounded="50%"
      />
      <Flex direction="column">
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
      {profile?.username != null && (
        <Box ml="auto">
          <Text>Username</Text>
          <Text fz="xl" fw={700}>
            {profile.username}
          </Text>
        </Box>
      )}
      {profile?.type != null && (
        <Box ml={64}>
          <Text>Profile Type</Text>
          <Text fz="xl" fw={700}>
            {capitalize(profile.type)}
          </Text>
        </Box>
      )}
      {profile?.language != null && (
        <Box ml={64}>
          <Text>Language</Text>
          <Text fz="xl" fw={700}>
            {locales.find((i) => i.value === profile.language)?.label}
          </Text>
        </Box>
      )}
    </Flex>
  );
};

export default ProfileBlock;
