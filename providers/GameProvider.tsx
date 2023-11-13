"use client";

import API from "@/utils/api";
import { type Game } from "@/models/GameModel";
import {
  type ProgressPayload,
  type ProgressItem,
} from "@/models/ProgressModel";
import {
  type TrophyFilters,
  type FormattedResponse,
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
} from "react";
import { IconAlertOctagon, IconCheck } from "@tabler/icons-react";
import { type NoteModalHandler, type NoteModalState } from "@/models/NoteModel";
import NoteModal from "@/modals/NoteModal";
import useCompletion from "@/hooks/useCompletion";

interface GameProviderProps extends PropsWithChildren {
  id: string | string[] | undefined;
  initialGame?: Game | null;
  initialTrophies?: FormattedResponse | null;
}

type Status = "idle" | "syncing" | "refetching" | "updating" | "completed";

interface GameContext {
  game: Game | null;
  trophies: FormattedResponse | null;
  progress: ProgressItem[];
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
  filters: TrophyFilters;
  setFilters: Dispatch<SetStateAction<TrophyFilters>>;
  resetFilters: () => void;
  checkAll: (value: boolean) => void;
  checkGroup: (group: string, value: boolean) => void;
  noteModal: NoteModalHandler;
}

const initialFilters: TrophyFilters = {
  type: "all",
  earned: "all",
};

const initialNoteState: NoteModalState = {
  opened: false,
  game_id: null,
  trophy_id: null,
};

const initialContextValue: GameContext = {
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
  checkAll: () => null,
  checkGroup: () => null,
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

const initializeProgress = (trophies: FormattedResponse): ProgressPayload => {
  const payload: ProgressItem[] = [];
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

const Context = createContext<GameContext>(initialContextValue);

const GameProvider: FC<GameProviderProps> = (props) => {
  const { children, id, initialGame = null, initialTrophies = null } = props;

  const [game, setGame] = useState<Game | null>(initialGame);
  const [progress, setProgress] = useState<ProgressItem[]>(
    initialGame?.progress ?? [],
  );
  const [debouncedProgress] = useDebouncedValue(progress, 700);
  const [trophies, setTrophies] = useState<FormattedResponse | null>(
    initialTrophies,
  );
  const [filters, setFilters] = useState<TrophyFilters>(initialFilters);
  const [noteModal, setNoteModal] = useState<NoteModalState>(initialNoteState);

  const [status, setStatus] = useState<Status>("idle");
  const isIdle = status === "idle";
  const isRefetching = status === "refetching";
  const isSyncing = status === "syncing";
  const isUpdating = status === "updating";
  const isCompleted = status === "completed";

  const isUserInteract = useRef<boolean>(false);
  const isAlreadyUpdated = useRef<boolean>(false);

  const isAllChecked = useCompletion(progress);

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

  const checkAll = (value: boolean): void => {
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

  const checkGroup = (group: string, value: boolean): void => {
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
      }),
    );
  };

  const openNote = (params?: Partial<NoteModalState>): void => {
    setNoteModal((prev) => ({ ...prev, ...params, opened: true }));
  };

  const closeNote = (): void => {
    setNoteModal((prev) => ({ ...prev, opened: false }));
  };

  const exposed: GameContext = {
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
    checkAll,
    checkGroup,
    noteModal: {
      ...noteModal,
      setState: setNoteModal,
      open: openNote,
      close: closeNote,
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
  }, [id, debouncedProgress]);

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
  }, [id, progress, trophies]);

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

export const useGame = (): GameContext => useContext(Context);

export default GameProvider;
