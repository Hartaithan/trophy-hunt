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
import { AlertOctagon, Check } from "tabler-icons-react";

interface IGameProviderProps extends PropsWithChildren {
  id: string | string[] | undefined;
  initialGame?: IGame | null;
  initialTrophies?: IFormattedResponse | null;
}

type Status = "idle" | "syncing" | "refetching" | "completed";

interface IGameContext {
  game: IGame | null;
  trophies: IFormattedResponse | null;
  progress: IProgressItem[];
  isIdle: boolean;
  isRefetching: boolean;
  isSyncing: boolean;
  isCompleted: boolean;
  refetchGame: () => void;
  refetchTrophies: () => void;
  updateProgress: (id: number) => void;
}

const initialContextValue: IGameContext = {
  game: null,
  trophies: null,
  progress: [],
  isIdle: true,
  isRefetching: false,
  isSyncing: false,
  isCompleted: false,
  refetchGame: () => null,
  refetchTrophies: () => null,
  updateProgress: () => null,
};

const Context = createContext<IGameContext>(initialContextValue);

const GameProvider: FC<IGameProviderProps> = (props) => {
  const { children, id, initialGame = null, initialTrophies = null } = props;

  const [game, setGame] = useState<IGame | null>(initialGame);
  const [progress, setProgress] = useState<IProgressItem[]>(
    initialGame?.progress ?? []
  );
  const [trophies, setTrophies] = useState<IFormattedResponse | null>(
    initialTrophies
  );

  const [status, setStatus] = useState<Status>("idle");
  const isIdle = status === "idle";
  const isRefetching = status === "refetching";
  const isSyncing = status === "syncing";
  const isCompleted = status === "completed";

  const [debouncedProgress] = useDebouncedValue(progress, 700);
  const isUserInteract = useRef<boolean>(false);

  const refetchGame = (): void => {
    if (typeof id !== "string") return;
    setStatus("refetching");
    API.get("/games/" + id)
      .then(({ data }) => {
        setGame(data?.game ?? null);
        setProgress(data?.game?.progress ?? []);
      })
      .catch((error) => {
        console.error("unable to refetch game", error);
      })
      .finally(() => {
        setStatus("completed");
      });
  };

  const refetchTrophies = (): void => {
    if (typeof id !== "string") return;
    setStatus("refetching");
    API.get("/games/" + id + "/earned")
      .then(({ data }) => {
        setTrophies(data ?? null);
      })
      .catch((error) => {
        console.error("unable to refetch trophies", error);
      })
      .finally(() => {
        setStatus("completed");
      });
  };

  const updateProgress = (id: number): void => {
    setStatus("syncing");
    notifications.show({
      id: "sync",
      loading: true,
      title: "Sync...",
      message:
        "Synchronizing progress on trophies... It shouldn't take long, don't reload the page.",
      autoClose: false,
      withCloseButton: false,
    });
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
    isIdle,
    isRefetching,
    isSyncing,
    isCompleted,
    refetchGame,
    refetchTrophies,
    updateProgress,
  };

  useEffect(() => {
    if (typeof id !== "string") return;
    if (!isUserInteract.current) return;
    setStatus("syncing");
    const payload = { payload: debouncedProgress };
    API.post("/games/" + id + "/progress", JSON.stringify(payload))
      .then((res) => {
        notifications.update({
          id: "sync",
          title: "Success!",
          message: res.data.message,
          icon: <Check size="1rem" />,
          autoClose: 3000,
        });
      })
      .catch((error) => {
        console.error("unable to sync trophies progress", error);
        notifications.update({
          id: "sync",
          color: "red",
          title: "Something went wrong!",
          message:
            "For some reason the synchronization did not complete, please try again.",
          icon: <AlertOctagon size="1rem" />,
        });
      })
      .finally(() => {
        setStatus("completed");
        isUserInteract.current = false;
      });
  }, [debouncedProgress]); // eslint-disable-line

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
};

export const useGame = (): IGameContext => useContext(Context);

export default GameProvider;
