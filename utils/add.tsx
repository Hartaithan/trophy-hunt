import { type BoardColumns, type BOARD_COLUMNS } from "@/models/BoardModel";
import { type Game, type ReorderItem } from "@/models/GameModel";
import { notifications } from "@mantine/notifications";
import API from "./api";
import { IconAlertOctagon, IconCheck } from "@tabler/icons-react";
import { type Dispatch, type SetStateAction } from "react";

export const addNewGame = (
  game: Game,
  setColumns: Dispatch<SetStateAction<BoardColumns>>,
): void => {
  const status: BOARD_COLUMNS | null = game?.status ?? null;
  if (status == null) return;
  setColumns((items) => {
    const newItems = [game, ...items[status]];
    const reorderItems: ReorderItem[] = newItems.map((i, index) => ({
      id: i.id,
      value: index,
      status: i.status,
    }));
    const payload = { items: reorderItems };
    notifications.show({
      id: "reorder",
      loading: true,
      title: "Sync...",
      message:
        "Synchronizing the order of games... It shouldn't take long, don't reload the page.",
      autoClose: false,
      withCloseButton: false,
    });
    API.post("/games/reorder", JSON.stringify(payload))
      .then((res) => {
        notifications.update({
          id: "reorder",
          loading: false,
          title: "Success!",
          message: res.data.message,
          icon: <IconCheck size="1rem" />,
          autoClose: 3000,
        });
      })
      .catch((error) => {
        notifications.update({
          id: "reorder",
          loading: false,
          color: "red",
          title: "Something went wrong!",
          message:
            "For some reason the synchronization did not complete, please try again.",
          icon: <IconAlertOctagon size="1rem" />,
          withCloseButton: true,
        });
        console.error("reorder columns error", error);
      });
    return {
      ...items,
      [status]: newItems,
    };
  });
};

export const validateGameCode = (value: string): string | null => {
  if (!/^NPWR/.test(value)) return "The code must begin with NPWR";
  if (value.length !== 12) return "Code must be 12 characters long";
  return null;
};
