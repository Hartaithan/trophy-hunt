import { FC } from "react";
import { View } from "react-native";
import { Text } from "~/ui/text";

const ProfilePage: FC = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-green-500">Profile Page</Text>
    </View>
  );
};

export default ProfilePage;
