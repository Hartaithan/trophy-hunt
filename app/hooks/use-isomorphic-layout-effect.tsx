import { useEffect, useLayoutEffect } from "react";
import { Platform } from "react-native";

export const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? useEffect
    : useLayoutEffect;
