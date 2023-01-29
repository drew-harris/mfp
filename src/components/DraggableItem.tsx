import { useDraggable } from "@dnd-kit/core";
import { DraggableItemData, MCNodeType, MCPickerItem } from "../types/MCNodes";
import { SpriteDisplay } from "./SpriteDisplay";
import { cva } from "cva";

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
    data: { item, type: item.dataType } as DraggableItemData,
  });

  const className = cva(
    ["border-4", "flex", "flex-col", "items-center", "border-mc-200", "p-3"],
    {
      variants: {
        nodeType: {
          [MCNodeType.resource]: "bg-green-300",
          [MCNodeType.crafter]: "bg-blue-200",
          [MCNodeType.order]: "bg-red-500",
          [MCNodeType.splitter]: "bg-gray-200",
          other: "bg-red-500",
        },
      },

      defaultVariants: {
        nodeType: "other",
      },
    }
  );

  // TODO: use cva to change background

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={className({ nodeType: item.dataType })}
      style={{
        zIndex: higher ? 500 : 100,
      }}
    >
      <div>{item.title}</div>
      <SpriteDisplay spriteIndex={item.spriteIndex} />
    </div>
  );
}
