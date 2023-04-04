import { useDraggable } from "@dnd-kit/core";
import {
  DraggableItemData,
  DraggableType,
  MCNodeType,
  MCPickerItem,
} from "../types/MCNodes";
import { SpriteDisplay } from "./SpriteDisplay";
import { cva } from "cva";
import { getNodeName } from "../utils/nodes";
import { FilterType, usePickerFilterStore } from "../stores/pickerFilterStore";

interface DraggableItemProps {
  item: MCPickerItem;
  higher?: boolean;
}

export default function DraggableItem({
  item,
  higher = false,
}: DraggableItemProps) {
  const filterType: FilterType =
    item.dataType === MCNodeType.resource
      ? FilterType.resource
      : FilterType.crafter;

  const enabled = usePickerFilterStore(
    (s) => s.switches[filterType] || s.switches["All Nodes"]
  );

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: item.itemId + item.dataType,
    data: {
      item,
      type: item.dataType,
      draggableType: DraggableType.item,
    } as DraggableItemData,
  });

  const className = cva(
    ["flex", "flex-col", "items-center", "p-3", "outset-4", "justify-between"],
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

  if (!enabled) return null;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={className({ nodeType: item.dataType })}
      style={{
        zIndex: higher ? 500 : 40,
      }}
    >
      <div className="text-xs">{getNodeName(item.dataType)}</div>
      <SpriteDisplay url={item.imageUrl} />
      <div className="text-center font-bold">{item.title}</div>
    </div>
  );
}
