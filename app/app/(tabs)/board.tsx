import { FC } from "react";
import { View } from "react-native";
import { Text } from "~/ui/text";

const BoardPage: FC = () => {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold">Board Page</Text>
    </View>
  );
};

export default BoardPage;
