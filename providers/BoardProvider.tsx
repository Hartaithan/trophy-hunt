import AddGameModal from "@/modals/AddGameModal";
import { type BOARD_COLUMNS } from "@/models/BoardModel";
import {
  type PropsWithChildren,
  type FC,
  createContext,
  useContext,
  useState,
} from "react";

type IBoardProviderProps = PropsWithChildren;

interface IAddGameState {
  status: BOARD_COLUMNS | null;
  opened: boolean;
}

interface IAddGameModal extends IAddGameState {
  open: (status: BOARD_COLUMNS) => void;
  close: () => void;
}

interface IBoardContext {
  addGameModal: IAddGameModal;
}

const initialState: IAddGameState = {
  status: null,
  opened: false,
};

const initialContextValue: IBoardContext = {
  addGameModal: {
    ...initialState,
    open: () => null,
    close: () => null,
  },
};

const Context = createContext<IBoardContext>(initialContextValue);

const BoardProvider: FC<IBoardProviderProps> = (props) => {
  const { children } = props;

  const [addGameModal, setAddGameModal] = useState<IAddGameState>(initialState);

  const handleOpen: IAddGameModal["open"] = (status) => {
    setAddGameModal((prev) => ({ ...prev, status, opened: true }));
  };

  const handleClose: IAddGameModal["close"] = () => {
    setAddGameModal(initialState);
  };

  const exposed: IBoardContext = {
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
        status={addGameModal.status}
        opened={addGameModal.opened}
        close={handleClose}
      />
    </Context.Provider>
  );
};

export const useBoard = (): IBoardContext => useContext(Context);

export default BoardProvider;
