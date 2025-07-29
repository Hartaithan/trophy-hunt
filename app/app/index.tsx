import { FC } from "react";
import { View } from "react-native";
import { Button } from "~/ui/button";
import { Text } from "~/ui/text";

const Index: FC = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-red-500">Hello World!</Text>
      <Button className="mt-2">
        <Text>Hello World!</Text>
      </Button>
    </View>
  );
};

export default Index;
