import { FC } from "react";
import { View } from "react-native";
import { Text } from "~/ui/text";

const HomePage: FC = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">Home Page</Text>
    </View>
  );
};

export default HomePage;
