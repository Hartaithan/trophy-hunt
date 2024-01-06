import { useState, type FC, type ReactNode, useCallback } from "react";
import VirtualList, {
  type RenderedRows,
  type Props,
  ScrollDirection,
  type ItemInfo,
} from "react-retiny-virtual-list";

interface ExtendedItemInfo extends ItemInfo {
  left: number;
}

type ItemsRenderedHandler = (rows: RenderedRows) => void;
type RenderItemHandler = (info: ExtendedItemInfo) => ReactNode;

interface ListProps extends Omit<Props, "renderItem"> {
  renderItem: RenderItemHandler;
}

const HorizontalList: FC<ListProps> = (props) => {
  const {
    onItemsRendered,
    scrollDirection = ScrollDirection.HORIZONTAL,
    renderItem,
    ...rest
  } = props;
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);

  const handleItemsRendered: ItemsRenderedHandler = useCallback(
    ({ startIndex }) => {
      setVisibleStartIndex(startIndex);
    },
    [],
  );

  const handleRenderItem: RenderItemHandler = useCallback(
    ({ index, style, ...args }) => {
      const left = style.left + (index - visibleStartIndex) * 10;
      return renderItem({ index, style, ...args, left });
    },
    [renderItem, visibleStartIndex],
  );

  return (
    <VirtualList
      scrollDirection={scrollDirection}
      onItemsRendered={handleItemsRendered}
      renderItem={handleRenderItem}
      {...rest}
    />
  );
};

export default HorizontalList;
