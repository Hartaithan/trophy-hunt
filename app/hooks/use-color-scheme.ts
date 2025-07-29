import { useColorScheme as useScheme } from "nativewind";

export const useColorScheme = () => {
  const { colorScheme, setColorScheme, toggleColorScheme } = useScheme();
  return {
    colorScheme: colorScheme ?? "dark",
    isDarkColorScheme: colorScheme === "dark",
    setColorScheme,
    toggleColorScheme,
  };
};
