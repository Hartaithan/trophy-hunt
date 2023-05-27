import API from "@/helpers/api";
import { type IGame } from "@/models/GameModel";
import { type IProgressItem } from "@/models/ProgressModel";
import { type IFormattedResponse } from "@/models/TrophyModel";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  type PropsWithChildren,
  type FC,
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";

interface IGameProviderProps extends PropsWithChildren {
  id: string | string[] | undefined;
  initialGame?: IGame | null;
  initialTrophies?: IFormattedResponse | null;
}

interface IGameContext {
  game: IGame | null;
  trophies: IFormattedResponse | null;
  progress: IProgressItem[];
  isLoading: boolean;
  refetchGame: () => void;
  refetchTrophies: () => void;
  updateProgress: (id: number) => void;
}

const initialContextValue: IGameContext = {
  game: null,
  trophies: null,
  progress: [],
  isLoading: false,
  refetchGame: () => null,
  refetchTrophies: () => null,
  updateProgress: () => null,
};

const Context = createContext<IGameContext>(initialContextValue);

const GameProvider: FC<IGameProviderProps> = (props) => {
  const { children, id, initialGame = null, initialTrophies = null } = props;

  const [isLoading, setLoading] = useState<boolean>(false);
  const [game, setGame] = useState<IGame | null>(initialGame);
  const [progress, setProgress] = useState<IProgressItem[]>(
    initialGame?.progress ?? []
  );
  const [trophies, setTrophies] = useState<IFormattedResponse | null>(
    initialTrophies
  );
  const [debouncedProgress] = useDebouncedValue(progress, 700);
  const isUserInteract = useRef<boolean>(false);

  const refetchGame = (): void => {
    if (typeof id !== "string") return;
    setLoading(true);
    API.get("/games/" + id)
      .then(({ data }) => {
        setGame(data?.game ?? null);
        setProgress(data?.game?.progress ?? []);
      })
      .catch((error) => {
        console.error("unable to refetch game", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const refetchTrophies = (): void => {
    if (typeof id !== "string") return;
    setLoading(true);
    API.get("/games/" + id + "/earned")
      .then(({ data }) => {
        setTrophies(data ?? null);
      })
      .catch((error) => {
        console.error("unable to refetch trophies", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateProgress = (id: number): void => {
    isUserInteract.current = true;
    setProgress((prev) => {
      const updated = [...prev].map((i) => {
        return { ...i, earned: i.id === id ? !i.earned : i.earned };
      });
      return updated;
    });
  };

  const exposed: IGameContext = {
    game,
    trophies,
    progress,
    isLoading,
    refetchGame,
    refetchTrophies,
    updateProgress,
  };

  useEffect(() => {
    if (typeof id !== "string") return;
    if (!isUserInteract.current) return;
    setLoading(true);
    const payload = { payload: debouncedProgress };
    API.post("/games/" + id + "/progress", JSON.stringify(payload))
      .then(({ data }) => {
        notifications.show({
          title: "Success!",
          message: data.message,
          autoClose: 3000,
        });
      })
      .catch((error) => {
        console.error("unable to sync trophies progress", error);
        notifications.show({
          title: "Something went wrong!",
          color: "red",
          message: error.response.data.message,
          autoClose: false,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [debouncedProgress]); // eslint-disable-line

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
};

export const useGame = (): IGameContext => useContext(Context);

export default GameProvider;
