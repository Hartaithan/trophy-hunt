import { FC } from "react";
import { View } from "react-native";
import { Button } from "~/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/ui/dialog";
import { Text } from "~/ui/text";

const HomePage: FC = () => {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold">Home Page</Text>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-3" variant="outline">
            <Text>Example</Text>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[90vw] sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Example</DialogTitle>
            <DialogDescription>Example description</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="w-full">
                <Text>OK</Text>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  );
};

export default HomePage;
