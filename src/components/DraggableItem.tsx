import { useDraggable } from "@dnd-kit/core";
import { MCItem, MCNodeType } from "../types/MCNodes";
import { SpriteDisplay } from "./SpriteDisplay";

interface DraggableItemProps {
  item: MCItem;
}

export default function DraggableItem({ item }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.itemId + item.dataType,
    data: { item },
  });

  // TODO: use cva to change background
  const isOutput =
    item.dataType === MCNodeType.output ? "bg-orange-200" : "bg-green-300";

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`border-4 ${isOutput} z-50 flex flex-col items-center border-mc-700 p-3`}
    >
      <div>{item.title}</div>
      <SpriteDisplay spriteIndex={item.spriteIndex} />
    </div>
  );
}
