"use client";

import AddGameModal from "@/modals/AddGameModal";
import { type BoardColumns, type BOARD_COLUMNS } from "@/models/BoardModel";
import { type Game, type AddGameState } from "@/models/GameModel";
import {
  type PropsWithChildren,
  type FC,
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

interface BoardProviderProps extends PropsWithChildren {
  initializedBoard: BoardColumns;
}

interface AddGameModalHandler extends AddGameState {
  open: (status: BOARD_COLUMNS) => void;
  close: () => void;
}

interface BoardContext {
  columns: BoardColumns;
  setColumns: Dispatch<SetStateAction<BoardColumns>>;
  active: Game | null;
  setActive: Dispatch<SetStateAction<Game | null>>;
  addGameModal: AddGameModalHandler;
}

const initialState: AddGameState = {
  status: null,
  opened: false,
};

const initialContextValue: BoardContext = {
  columns: {},
  setColumns: () => null,
  active: null,
  setActive: () => null,
  addGameModal: {
    ...initialState,
    open: () => null,
    close: () => null,
  },
};

const Context = createContext<BoardContext>(initialContextValue);

const BoardProvider: FC<BoardProviderProps> = (props) => {
  const { children, initializedBoard } = props;

  const [columns, setColumns] = useState<BoardColumns>(initializedBoard);
  const [addGameModal, setAddGameModal] = useState<AddGameState>(initialState);
  const [active, setActive] = useState<Game | null>(null);

  const handleOpen: AddGameModalHandler["open"] = (status) => {
    setAddGameModal((prev) => ({ ...prev, status, opened: true }));
  };

  const handleClose: AddGameModalHandler["close"] = () => {
    setAddGameModal(initialState);
  };

  const exposed: BoardContext = {
    columns,
    setColumns,
    active,
    setActive,
    addGameModal: {
      status: addGameModal.status,
      opened: addGameModal.opened,
      open: handleOpen,
      close: handleClose,
    },
  };

  return (
    <Context.Provider value={exposed}>
      {children}
      <AddGameModal
        state={addGameModal}
        setState={setAddGameModal}
        initial={initialState}
      />
    </Context.Provider>
  );
};

export const useBoard = (): BoardContext => useContext(Context);

export default BoardProvider;
