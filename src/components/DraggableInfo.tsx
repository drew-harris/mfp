import { useDraggable } from "@dnd-kit/core";
import { DraggableInfo, MCNodeType } from "../types/MCNodes";

interface DraggableInfoProps {
  higher?: boolean;
}

export default function DraggableInfoSquare({
  higher = false,
}: DraggableInfoProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: "info",
    data: { type: MCNodeType.info } as DraggableInfo,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="flex flex-col items-center p-3 border-4 bg-mc-300 border-mc-200"
      style={{
        zIndex: higher ? 500 : 100,
      }}
    >
      <div className="font-bold">Info</div>
    </div>
  );
}
