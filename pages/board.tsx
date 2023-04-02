import BoardCard from "@/components/BoardCard";
import BoardColumn from "@/components/BoardColumn";
import BoardContainer from "@/components/BoardContainer";
import { randomNum } from "@/helpers/number";
import { type IPage } from "@/models/AppModel";
import {
  type IBoardItem,
  type IBoardColumn,
  BOARD_COLUMNS,
} from "@/models/BoardModel";
import { DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
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
    id: 1,
    title: BOARD_COLUMNS.Backlog,
    items: generateItems(1, 6),
  },
  {
    id: 2,
    title: BOARD_COLUMNS.InProgress,
    items: generateItems(7, 10),
  },
  {
    id: 3,
    title: BOARD_COLUMNS.Platinum,
    items: generateItems(11, 20),
  },
  {
    id: 4,
    title: BOARD_COLUMNS.Complete,
    items: generateItems(21, 25),
  },
];

const BoardPage: IPage = () => {
  return (
    <DndContext>
      <SortableContext items={columns} strategy={horizontalListSortingStrategy}>
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
      </SortableContext>
    </DndContext>
  );
};

export default BoardPage;
