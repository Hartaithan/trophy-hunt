import { FC } from "react";
import { View } from "react-native";
import { Text } from "~/ui/text";

const BoardPage: FC = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-yellow-500">Board Page</Text>
    </View>
  );
};

export default BoardPage;
