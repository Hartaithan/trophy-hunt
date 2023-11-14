"use client";

import Congratulation from "@/components/Congratulation/Congratulation";
import { Transition } from "@mantine/core";
import {
  createContext,
  useContext,
  type FC,
  type PropsWithChildren,
  useState,
  useCallback,
} from "react";

export type CongratulationValue = "platinum" | "complete";

interface CongratulationState {
  value: CongratulationValue | null;
  isVisible: boolean;
}

interface CongratulationContext extends CongratulationState {
  show: (value: CongratulationValue) => void;
}

const initialState: CongratulationState = {
  value: "platinum",
  isVisible: false,
};

const initialContextValue: CongratulationContext = {
  ...initialState,
  show: () => null,
};

const Context = createContext(initialContextValue);

const CongratulationProvider: FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const [state, setState] = useState(initialState);
  const { isVisible, value } = state;

  const show = useCallback((value: CongratulationValue): void => {
    setState((prev) => ({ ...prev, isVisible: true, value }));
    const timeout = setTimeout(() => {
      setState((prev) => ({ ...prev, isVisible: false }));
      clearTimeout(timeout);
    }, 3000);
  }, []);

  const clear = (): void => {
    setState(initialState);
  };

  const exposed: CongratulationContext = {
    ...state,
    show,
  };

  return (
    <Context.Provider value={exposed}>
      <Transition
        mounted={isVisible}
        duration={400}
        transition="slide-down"
        timingFunction="ease"
        onExited={clear}>
        {(styles) => <Congratulation styles={styles} value={value} />}
      </Transition>
      {children}
    </Context.Provider>
  );
};

export const useCongratulation = (): CongratulationContext =>
  useContext(Context);

export default CongratulationProvider;
