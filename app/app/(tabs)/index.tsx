import { FC } from "react";
import { View } from "react-native";
import { Text } from "~/ui/text";

const HomePage: FC = () => {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold">Home Page</Text>
    </View>
  );
};

export default HomePage;
