import { useDraggable } from "@dnd-kit/core";
import { MCItem, MCNodeType } from "../types/MCNodes";

interface DraggableItemProps {
  item: MCItem;
}

export default function DraggableItem({ item }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.itemId + item.dataType,
    data: { item },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  // TODO: use cva to change background
  const isOutput =
    item.dataType === MCNodeType.output ? "bg-orange-500" : "bg-green-500";
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`border-4 ${isOutput}  flex flex-col items-center border-mc-700 p-3`}
    >
      <div>{item.title}</div>
      <img src={item.imageUrl || "/grass.png"}></img>
    </div>
  );
}
