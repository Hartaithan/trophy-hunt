"use client";

import { type AddGameState } from "@/models/GameModel";
import { type Dispatch, type SetStateAction, type FC } from "react";

interface Props {
  state: AddGameState;
  onClose: () => void;
  setSubmit: Dispatch<SetStateAction<boolean>>;
}

const AddGameCodeTab: FC<Props> = () => {
  return <div>AddGameCodeTab</div>;
};

export default AddGameCodeTab;
