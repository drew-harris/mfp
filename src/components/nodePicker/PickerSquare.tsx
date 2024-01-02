import { useDraggable } from "@dnd-kit/core";
import { cva } from "cva";
import { ReactNode } from "react";
import { DraggableData, MCNodeType } from "../../types/MCNodes";

export interface DraggableProps {
  payload: DraggableData;
  topLabel?: string;
  mainLabel?: string;
  image?: ReactNode;
  higher?: boolean;
}

export default function PickerSquare(props: DraggableProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: JSON.stringify(props.payload),
    data: props,
  });
  const className = cva(
    [
      "flex",
      "flex-col",
      "overflow-hidden",
      "items-center",
      "p-3",
      "outset-4",
      "justify-between",
    ],
    {
      variants: {
        nodeType: {
          [MCNodeType.resource]: "bg-green-300",
          [MCNodeType.crafter]: "bg-blue-200",
          [MCNodeType.order]: "bg-red-500",
          [MCNodeType.splitter]: "bg-gray-300",
          [MCNodeType.builder]: "bg-red-100",
        },
      },
    }
  );
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={className({ nodeType: props.payload.type })}
      style={{
        zIndex: props.higher ? 500 : 40,
      }}
    >
      <div className="text-xs">{props.topLabel}</div>
      {props.image}
      <div className="text-center font-bold">{props.mainLabel}</div>
    </div>
  );
}
