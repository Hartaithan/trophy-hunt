import BoardCard from "@/components/BoardCard";
import BoardColumn from "@/components/BoardColumn";
import BoardContainer from "@/components/BoardContainer";
import { generateItems, initializeBoard } from "@/helpers/board";
import { type IPage } from "@/models/AppModel";
import { type BOARD_COLUMNS, type IBoardItem } from "@/models/BoardModel";
import { DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { type GetServerSideProps } from "next";

interface IBoardPageProps {
  items: IBoardItem[];
}

export const getServerSideProps: GetServerSideProps<
  IBoardPageProps
> = async () => {
  const items: IBoardItem[] = generateItems(1, 25);
  const props: IBoardPageProps = { items };
  return { props };
};

const BoardPage: IPage<IBoardPageProps> = (props) => {
  const { items } = props;
  const columns = initializeBoard(items);
  return (
    <DndContext>
      <BoardContainer>
        {Object.keys(columns).map((col) => {
          const key = col as BOARD_COLUMNS;
          const items = columns[key];
          return (
            <BoardColumn key={col} column={key}>
              <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
              >
                {items.map((item) => (
                  <BoardCard key={item.id} item={item} />
                ))}
              </SortableContext>
            </BoardColumn>
          );
        })}
      </BoardContainer>
    </DndContext>
  );
};

export default BoardPage;
