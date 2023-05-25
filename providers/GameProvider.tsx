import API from "@/helpers/api";
import { type IGame } from "@/models/GameModel";
import { type IFormattedResponse } from "@/models/TrophyModel";
import {
  type PropsWithChildren,
  type FC,
  createContext,
  useState,
  useContext,
} from "react";

interface IGameProviderProps extends PropsWithChildren {
  id: string | string[] | undefined;
  initialGame?: IGame | null;
  initialTrophies?: IFormattedResponse | null;
}

interface IGameContext {
  game: IGame | null;
  trophies: IFormattedResponse | null;
  refetchGame: () => void;
  refetchTrophies: () => void;
}

const initialContextValue: IGameContext = {
  game: null,
  trophies: null,
  refetchGame: () => null,
  refetchTrophies: () => null,
};

const Context = createContext<IGameContext>(initialContextValue);

const GameProvider: FC<IGameProviderProps> = (props) => {
  const { children, id, initialGame = null, initialTrophies = null } = props;

  const [game, setGame] = useState<IGame | null>(initialGame);
  const [trophies, setTrophies] = useState<IFormattedResponse | null>(
    initialTrophies
  );

  const refetchGame = (): void => {
    if (typeof id !== "string") return;
    API.get("/games/" + id)
      .then(({ data }) => {
        setGame(data?.game ?? null);
      })
      .catch((error) => {
        console.error("unable to refetch game", error);
      });
  };

  const refetchTrophies = (): void => {
    if (typeof id !== "string") return;
    API.get("/games/" + id + "/earned")
      .then(({ data }) => {
        setTrophies(data ?? null);
      })
      .catch((error) => {
        console.error("unable to refetch trophies", error);
      });
  };

  const exposed: IGameContext = {
    game,
    trophies,
    refetchGame,
    refetchTrophies,
  };

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
};

export const useGame = (): IGameContext => useContext(Context);

export default GameProvider;
