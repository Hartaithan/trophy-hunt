import API from "@/helpers/api";
import { type IGame } from "@/models/GameModel";
import {
  type IProgressPayload,
  type IProgressItem,
} from "@/models/ProgressModel";
import {
  type ITrophyFilters,
  type IFormattedResponse,
} from "@/models/TrophyModel";
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
  type Dispatch,
  type SetStateAction,
  useMemo,
} from "react";
import { useReward } from "react-rewards";
import { IconAlertOctagon, IconCheck } from "@tabler/icons-react";
import {
  type CongratulationValue,
  useCongratulation,
} from "./CongratulationProvider";
import { type INoteModal, type INoteModalState } from "@/models/NoteModel";
import NoteModal from "@/modals/NoteModal";

interface IGameProviderProps extends PropsWithChildren {
  id: string | string[] | undefined;
  initialGame?: IGame | null;
  initialTrophies?: IFormattedResponse | null;
}

type Status = "idle" | "syncing" | "refetching" | "updating" | "completed";

interface IGameContext {
  game: IGame | null;
  trophies: IFormattedResponse | null;
  progress: IProgressItem[];
  isIdle: boolean;
  isRefetching: boolean;
  isSyncing: boolean;
  isUpdating: boolean;
  isCompleted: boolean;
  isAllChecked: boolean;
  refetchGame: () => void;
  refetchTrophies: () => void;
  syncProgress: () => void;
  toggleTrophy: (id: number) => void;
  filters: ITrophyFilters;
  setFilters: Dispatch<SetStateAction<ITrophyFilters>>;
  resetFilters: () => void;
  handleCheckAll: (value: boolean) => void;
  handleCheckGroup: (group: string, value: boolean) => void;
  noteModal: INoteModal;
}

const rewardConfig = {
  spread: 100,
  startVelocity: 50,
  elementCount: 100,
};

const initialFilters: ITrophyFilters = {
  type: "all",
  earned: "all",
};

const initialNoteState: INoteModalState = {
  opened: false,
  game_id: null,
  trophy_id: null,
};

const initialContextValue: IGameContext = {
  game: null,
  trophies: null,
  progress: [],
  isIdle: true,
  isRefetching: false,
  isSyncing: false,
  isUpdating: false,
  isCompleted: false,
  isAllChecked: false,
  refetchGame: () => null,
  refetchTrophies: () => null,
  syncProgress: () => null,
  toggleTrophy: () => null,
  filters: initialFilters,
  setFilters: () => null,
  resetFilters: () => null,
  handleCheckAll: () => null,
  handleCheckGroup: () => null,
  noteModal: {
    ...initialNoteState,
    setState: () => null,
    open: () => null,
    close: () => null,
  },
};

const syncStartedMessage =
  "Synchronizing progress on trophies... It shouldn't take long, don't reload the page.";
const syncErrorMessage =
  "For some reason the synchronization did not complete, please try again.";

const initializeProgress = (trophies: IFormattedResponse): IProgressPayload => {
  const payload: IProgressItem[] = [];
  for (let i = 0; i < trophies.groups.length; i++) {
    const group = trophies.groups[i];
    for (let n = 0; n < group.trophies.length; n++) {
      const trophy = group.trophies[n];
      payload.push({
        id: trophy.id,
        earned: false,
        group: group.id,
        dlc: group.id !== "default",
      });
    }
  }
  return { payload };
};

const Context = createContext<IGameContext>(initialContextValue);

const GameProvider: FC<IGameProviderProps> = (props) => {
  const { children, id, initialGame = null, initialTrophies = null } = props;

  const [game, setGame] = useState<IGame | null>(initialGame);
  const [progress, setProgress] = useState<IProgressItem[]>(
    initialGame?.progress ?? []
  );
  const [debouncedProgress] = useDebouncedValue(progress, 700);
  const [trophies, setTrophies] = useState<IFormattedResponse | null>(
    initialTrophies
  );
  const [filters, setFilters] = useState<ITrophyFilters>(initialFilters);
  const [noteModal, setNoteModal] = useState<INoteModalState>(initialNoteState);

  const [status, setStatus] = useState<Status>("idle");
  const isIdle = status === "idle";
  const isRefetching = status === "refetching";
  const isSyncing = status === "syncing";
  const isUpdating = status === "updating";
  const isCompleted = status === "completed";

  const isUserInteract = useRef<boolean>(false);
  const isMounted = useRef<boolean>(false);
  const isAlreadyUpdated = useRef<boolean>(false);
  const allCount = useRef<number>(0);

  const { reward } = useReward("reward", "confetti", rewardConfig);
  const { show } = useCongratulation();

  const isAllChecked = useMemo(() => {
    let base_count = 0;
    let all_count = 0;
    for (let i = 0; i < progress.length; i++) {
      const el = progress[i];
      base_count = base_count + (!el.dlc ? 1 : 0);
      all_count = all_count + (el.earned ? 1 : 0);
    }
    const countIsDecrement = all_count < allCount.current;
    allCount.current = all_count;
    let value: CongratulationValue | null = null;
    const isPlatinum = base_count === all_count;
    const isComplete = all_count === progress.length;
    if (isPlatinum) value = "platinum";
    if (isComplete) value = "complete";
    if (countIsDecrement) return isComplete;
    if (value === null) return isComplete;
    if (!isMounted.current) return isComplete;
    if (typeof window === "undefined") return isComplete;
    reward();
    show(value);
    return isComplete;
  }, [progress]); // eslint-disable-line

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
    API.get("/games/" + id + "/trophies")
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

  const toggleTrophy = (id: number): void => {
    setStatus("syncing");
    notifications.show({
      id: "sync",
      loading: true,
      title: "Sync...",
      message: syncStartedMessage,
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

  const syncProgress = (): void => {
    if (typeof id !== "string") return;
    setStatus("syncing");
    notifications.show({
      id: "sync",
      loading: true,
      title: "Sync...",
      message: syncStartedMessage,
      autoClose: false,
      withCloseButton: false,
    });
    API.get("/games/" + id + "/sync")
      .then(({ data }) => {
        if (data.progress == null) return;
        setProgress(data.progress ?? null);
        notifications.update({
          id: "sync",
          title: "Success!",
          message: data.message,
          icon: <IconCheck size="1rem" />,
          autoClose: 3000,
        });
      })
      .catch((error) => {
        console.error("unable to refetch trophies", error);
        notifications.update({
          id: "sync",
          color: "red",
          title: "Something went wrong!",
          autoClose: false,
          message: error.response.data.message ?? syncErrorMessage,
          icon: <IconAlertOctagon size="1rem" />,
        });
      })
      .finally(() => {
        setStatus("completed");
      });
  };

  const resetFilters = (): void => {
    setFilters(initialFilters);
  };

  const handleCheckAll = (value: boolean): void => {
    setStatus("syncing");
    notifications.show({
      id: "sync",
      loading: true,
      title: "Sync...",
      message: syncStartedMessage,
      autoClose: false,
      withCloseButton: false,
    });
    isUserInteract.current = true;
    setProgress((prev) => prev.map((item) => ({ ...item, earned: value })));
  };

  const handleCheckGroup = (group: string, value: boolean): void => {
    setStatus("syncing");
    notifications.show({
      id: "sync",
      loading: true,
      title: "Sync...",
      message: syncStartedMessage,
      autoClose: false,
      withCloseButton: false,
    });
    isUserInteract.current = true;
    setProgress((prev) =>
      prev.map((item) => {
        const isMatch = item.group === group;
        return { ...item, earned: isMatch ? value : item.earned };
      })
    );
  };

  const handleNoteOpen = (params?: Partial<INoteModalState>): void => {
    setNoteModal((prev) => ({ ...prev, ...params, opened: true }));
  };

  const handleNoteClose = (): void => {
    setNoteModal((prev) => ({ ...prev, opened: false }));
  };

  const exposed: IGameContext = {
    game,
    trophies,
    progress,
    isIdle,
    isRefetching,
    isSyncing,
    isUpdating,
    isCompleted,
    isAllChecked,
    refetchGame,
    refetchTrophies,
    syncProgress,
    toggleTrophy,
    filters,
    setFilters,
    resetFilters,
    handleCheckAll,
    handleCheckGroup,
    noteModal: {
      ...noteModal,
      setState: setNoteModal,
      open: handleNoteOpen,
      close: handleNoteClose,
    },
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
          icon: <IconCheck size="1rem" />,
          autoClose: 3000,
        });
      })
      .catch((error) => {
        console.error("unable to sync trophies progress", error);
        notifications.update({
          id: "sync",
          color: "red",
          title: "Something went wrong!",
          message: error.response.data.message ?? syncErrorMessage,
          icon: <IconAlertOctagon size="1rem" />,
        });
      })
      .finally(() => {
        setStatus("completed");
        isUserInteract.current = false;
      });
  }, [debouncedProgress]); // eslint-disable-line

  useEffect(() => {
    if (typeof id !== "string") return;
    if (isAlreadyUpdated.current) return;
    const count = trophies?.count ?? -1;
    if (progress.length < count && trophies != null) {
      const payload = initializeProgress(trophies);
      isAlreadyUpdated.current = true;
      notifications.show({
        id: "update",
        loading: true,
        title: "Updating...",
        message:
          "We've noticed a difference in progress, we're doing an update... It shouldn't take long, don't reload the page.",
        autoClose: false,
        withCloseButton: false,
      });
      setStatus("updating");
      API.post("/games/" + id + "/progress", JSON.stringify(payload))
        .then((res) => {
          if (res.data.progress != null) {
            setProgress(res.data.progress);
          }
          notifications.update({
            id: "update",
            title: "Success!",
            message: res.data.message,
            icon: <IconCheck size="1rem" />,
            autoClose: 3000,
          });
        })
        .catch((error) => {
          console.error("unable to update progress", error);
          notifications.update({
            id: "update",
            color: "red",
            title: "Something went wrong!",
            message:
              "For some reason the update is not complete, please try again later.",
            icon: <IconAlertOctagon size="1rem" />,
          });
        })
        .finally(() => {
          setStatus("completed");
        });
    } else {
      console.info("doesn't need update");
    }
  }, [progress, trophies]); // eslint-disable-line

  useEffect(() => {
    isMounted.current = true;
  }, []);

  return (
    <Context.Provider value={exposed}>
      {children}
      <NoteModal
        state={noteModal}
        setState={setNoteModal}
        initial={initialNoteState}
      />
    </Context.Provider>
  );
};

export const useGame = (): IGameContext => useContext(Context);

export default GameProvider;
