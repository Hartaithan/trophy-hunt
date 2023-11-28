"use client";

import { type Game } from "@/models/GameModel";
import { Menu, UnstyledButton, Text } from "@mantine/core";
import { memo, type FC, type MouseEventHandler } from "react";
import { IconDots, IconArrowUpRight, IconTrash } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { useBoard } from "@/providers/BoardProvider";
import API from "@/utils/api";
import { type BoardColumns } from "@/models/BoardModel";
import { notifications } from "@mantine/notifications";
import Link from "../Link/Link";
import classes from "./BoardCardMenu.module.css";

interface BoardCardMenuProps {
  item: Game;
}

const BoardCardMenu: FC<BoardCardMenuProps> = (props) => {
  const { id, status } = props.item;
  const { columns, setColumns } = useBoard();

  const stopPropagation: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
  };

  const handleDelete = (): void => {
    let previousState: BoardColumns = { ...columns };
    setColumns((prev) => {
      previousState = prev;
      const column = [...prev[status]];
      return { ...prev, [status]: column.filter((i) => i.id !== id) };
    });
    API.delete(`/games/${id}`)
      .then((res) => {
        notifications.show({
          title: "Success!",
          message: res.data.message,
          autoClose: 3000,
        });
      })
      .catch((error) => {
        setColumns(previousState);
        notifications.show({
          title: "Something went wrong!",
          color: "red",
          message: error.response.data.message,
          autoClose: false,
        });
        console.error("delete game error", error);
      });
  };

  const handleDeleteModal: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    modals.openConfirmModal({
      title: "Are you sure?",
      centered: true,
      children: (
        <Text size="sm">
          Do you really want to delete this game? This process cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "No don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => {
        console.info("user cancelled delete");
      },
      onConfirm: handleDelete,
    });
  };

  return (
    <Menu shadow="md" width={150} data-no-dnd="true" position="bottom-end">
      <Menu.Target>
        <UnstyledButton className={classes.actions} onClick={stopPropagation}>
          <IconDots size="1.5rem" />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown data-no-dnd="true">
        <Menu.Item
          leftSection={<IconArrowUpRight size="1rem" />}
          component={Link}
          href={`/game/${id}`}>
          Open
        </Menu.Item>
        <Menu.Item
          leftSection={<IconTrash size="1rem" />}
          onClick={handleDeleteModal}>
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default memo(BoardCardMenu);
