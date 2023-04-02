import BoardCard from "@/components/BoardCard";
import BoardColumn from "@/components/BoardColumn";
import BoardContainer from "@/components/BoardContainer";
import { randomNum } from "@/helpers/number";
import { type IPage } from "@/models/AppModel";
import {
  type IBoardItem,
  type IBoardColumn,
  BOARD_COLUMNS,
  BOARD_COLUMNS_LABELS,
} from "@/models/BoardModel";
import { DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const generateItems = (from: number, to: number): IBoardItem[] => {
  const items = Array.from(
    { length: to - from + 1 },
    (_, index): IBoardItem => {
      const random = randomNum(1, 4);
      const size = random <= 2 ? "320/176" : "512/512";
      return {
        id: from + index,
        title: `Item ${from + index}`,
        image_url: `https://picsum.photos/${size}?random=${from + index}`,
      };
    }
  );
  return items;
};

const columns: IBoardColumn[] = [
  {
    id: BOARD_COLUMNS.Backlog,
    label: BOARD_COLUMNS_LABELS.Backlog,
    items: generateItems(1, 6),
  },
  {
    id: BOARD_COLUMNS.InProgress,
    label: BOARD_COLUMNS_LABELS.InProgress,
    items: generateItems(7, 10),
  },
  {
    id: BOARD_COLUMNS.Platinum,
    label: BOARD_COLUMNS_LABELS.Platinum,
    items: generateItems(11, 20),
  },
  {
    id: BOARD_COLUMNS.Complete,
    label: BOARD_COLUMNS_LABELS.Complete,
    items: generateItems(21, 25),
  },
];

const BoardPage: IPage = () => {
  return (
    <DndContext>
      <BoardContainer>
        {columns.map((col) => (
          <BoardColumn key={col.id} column={col}>
            <SortableContext
              items={col.items}
              strategy={verticalListSortingStrategy}
            >
              {col.items.map((item) => (
                <BoardCard key={item.id} item={item} />
              ))}
            </SortableContext>
          </BoardColumn>
        ))}
      </BoardContainer>
    </DndContext>
  );
};

export default BoardPage;
