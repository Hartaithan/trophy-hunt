import { type IGame } from "@/models/GameModel";
import { Menu, UnstyledButton, createStyles, Text } from "@mantine/core";
import { memo, type FC, type MouseEventHandler } from "react";
import { Dots, Edit, Trash } from "tabler-icons-react";
import { modals } from "@mantine/modals";
import { useBoard } from "@/providers/BoardProvider";
import API from "@/helpers/api";
import { type IBoardColumns } from "@/models/BoardModel";
import { notifications } from "@mantine/notifications";

interface IBoardCardMenuProps {
  item: IGame;
}

const useStyles = createStyles(() => ({
  actions: {
    marginLeft: "auto",
    height: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const BoardCardMenu: FC<IBoardCardMenuProps> = (props) => {
  const { id, status } = props.item;
  const { classes } = useStyles();
  const { columns, setColumns } = useBoard();

  const stopPropagation: MouseEventHandler<HTMLButtonElement> = (e) =>
    e.stopPropagation();

  const handleDelete = (): void => {
    let previousState: IBoardColumns = { ...columns };
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
      onCancel: () => console.info("user cancelled delete"),
      onConfirm: handleDelete,
    });
  };

  const handleEditModal: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    alert("TODO: add edit modal");
  };

  return (
    <Menu shadow="md" width={150} data-no-dnd="true" position="bottom-end">
      <Menu.Target>
        <UnstyledButton className={classes.actions} onClick={stopPropagation}>
          <Dots size="1.5rem" />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown data-no-dnd="true">
        <Menu.Item icon={<Edit size="1rem" />} onClick={handleEditModal}>
          Edit
        </Menu.Item>
        <Menu.Item icon={<Trash size="1rem" />} onClick={handleDeleteModal}>
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default memo(BoardCardMenu);