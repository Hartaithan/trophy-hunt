import {
  type AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
  useSortable,
} from "@dnd-kit/sortable";
import {
  Box,
  Flex,
  Menu,
  Overlay,
  Text,
  UnstyledButton,
  createStyles,
} from "@mantine/core";
import Image from "next/image";
import { type FC, memo } from "react";
import { CSS } from "@dnd-kit/utilities";
import { type IGame } from "@/models/GameModel";
import ColumnBadge from "./ColumnBadge";
import PlatformBadge from "./PlatformBadge";
import ProgressStats from "./ProgressStats";
import { Dots, Edit, Trash } from "tabler-icons-react";
import { modals } from "@mantine/modals";
import { useBoard } from "@/providers/BoardProvider";
import API from "@/helpers/api";
import { type IBoardColumns } from "@/models/BoardModel";
import { notifications } from "@mantine/notifications";

interface IBoardCardProps {
  item: IGame;
}

const animateLayoutChanges: AnimateLayoutChanges = (args) => {
  const { isSorting, wasDragging } = args;
  if (isSorting || wasDragging) return defaultAnimateLayoutChanges(args);
  return true;
};

const useStyles = createStyles(({ colors, radius, spacing }) => {
  return {
    container: {
      width: "100%",
      padding: spacing.xs,
      background: colors.primary[6],
      borderRadius: radius.md,
    },
    imageWrapper: {
      position: "relative",
      width: "100%",
      aspectRatio: "320 / 176",
      overflow: "hidden",
      borderRadius: radius.md,
    },
    image: {
      objectFit: "contain",
      zIndex: 3,
      filter:
        "drop-shadow(0 0 100px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 100px rgba(0, 0, 0, 0.9))",
    },
    background: {
      objectFit: "cover",
      zIndex: 1,
      filter: "blur(5px)",
    },
    draggable: {
      zIndex: 99999,
    },
    header: {
      justifyContent: "flex-start",
      gap: spacing.xs,
      marginBottom: spacing.xs,
    },
    actions: {
      marginLeft: "auto",
      height: 20,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  };
});

const BoardCard: FC<IBoardCardProps> = (props) => {
  const { item } = props;
  const { id, title, image_url, status, platform, progress } = item;

  const { columns, setColumns } = useBoard();
  const { classes, cx } = useStyles();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, animateLayoutChanges });

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

  const handleDeleteModal = (): void => {
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

  const MemoizedMenu = memo(() => (
    <Menu shadow="md" width={150} data-no-dnd="true" position="bottom-end">
      <Menu.Target>
        <UnstyledButton className={classes.actions}>
          <Dots size="1.5rem" />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown data-no-dnd="true">
        <Menu.Item
          icon={<Edit size="1rem" />}
          onClick={() => alert("TODO: add edit modal")}
        >
          Edit
        </Menu.Item>
        <Menu.Item
          icon={<Trash size="1rem" />}
          onClick={() => handleDeleteModal()}
        >
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  ));

  return (
    <Flex
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cx([classes.container, isDragging && classes.draggable])}
      direction="column"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <Flex className={classes.header}>
        <ColumnBadge status={status} />
        <PlatformBadge platform={platform} />
        <MemoizedMenu />
      </Flex>
      <Box className={classes.imageWrapper}>
        <Image
          className={classes.image}
          src={image_url}
          fill
          alt="image card"
        />
        <Overlay
          zIndex={2}
          gradient="linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))"
        />
        <Image
          className={classes.background}
          src={image_url}
          fill
          alt="image card"
        />
      </Box>
      <Text mt={6} fw={500} lineClamp={2}>
        {title}
      </Text>
      <ProgressStats progress={progress} />
    </Flex>
  );
};

export default BoardCard;
