import { type Dispatch, type SetStateAction } from "react";

interface DefaultModalProps {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
}

export type IModalProps<T = object> = T & DefaultModalProps;
