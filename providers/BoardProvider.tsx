import AddGameModal from "@/modals/AddGameModal";
import { type IBoardColumns, type BOARD_COLUMNS } from "@/models/BoardModel";
import { type IGame, type IAddGameState } from "@/models/GameModel";
import {
  type PropsWithChildren,
  type FC,
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

interface IBoardProviderProps extends PropsWithChildren {
  initializedBoard: IBoardColumns;
}

interface IAddGameModal extends IAddGameState {
  open: (status: BOARD_COLUMNS) => void;
  close: () => void;
}

interface IBoardContext {
  columns: IBoardColumns;
  setColumns: Dispatch<SetStateAction<IBoardColumns>>;
  active: IGame | null;
  setActive: Dispatch<SetStateAction<IGame | null>>;
  addGameModal: IAddGameModal;
}

const initialState: IAddGameState = {
  status: null,
  opened: false,
};

const initialContextValue: IBoardContext = {
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

const Context = createContext<IBoardContext>(initialContextValue);

const BoardProvider: FC<IBoardProviderProps> = (props) => {
  const { children, initializedBoard } = props;

  const [columns, setColumns] = useState<IBoardColumns>(initializedBoard);
  const [addGameModal, setAddGameModal] = useState<IAddGameState>(initialState);
  const [active, setActive] = useState<IGame | null>(null);

  const handleOpen: IAddGameModal["open"] = (status) => {
    setAddGameModal((prev) => ({ ...prev, status, opened: true }));
  };

  const handleClose: IAddGameModal["close"] = () => {
    setAddGameModal(initialState);
  };

  const exposed: IBoardContext = {
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

export const useBoard = (): IBoardContext => useContext(Context);

export default BoardProvider;
