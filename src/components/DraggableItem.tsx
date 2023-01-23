import { useDraggable } from "@dnd-kit/core";
import { DraggableData, MCNodeType, MCPickerItem } from "../types/MCNodes";
import { SpriteDisplay } from "./SpriteDisplay";

interface DraggableItemProps {
  item: MCPickerItem;
  higher?: boolean;
}

export default function DraggableItem({
  item,
  higher = false,
}: DraggableItemProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: item.itemId + item.dataType,
    data: { item, type: item.dataType } as DraggableData,
  });

  // TODO: use cva to change background
  const isOutput =
    item.dataType === MCNodeType.output ? "bg-orange-200" : "bg-green-300";

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`border-4 ${isOutput} flex flex-col items-center border-mc-700 p-3`}
      style={{
        zIndex: higher ? 500 : 100,
      }}
    >
      <div>{item.title}</div>
      <SpriteDisplay spriteIndex={item.spriteIndex} />
    </div>
  );
}
