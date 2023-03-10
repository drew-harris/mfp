import { useDraggable } from "@dnd-kit/core";
import {
  DraggableSplitterData,
  DraggableType,
  MCNodeType,
} from "../types/MCNodes";

interface DraggableSplitterProps {
  higher?: boolean;
}

export default function DraggableSplitter({
  higher = false,
}: DraggableSplitterProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: "splitter",
    data: {
      type: MCNodeType.splitter,
      draggableType: DraggableType.splitter,
    } as DraggableSplitterData,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="flex flex-col items-center p-3 border-4 bg-mc-300 border-mc-200"
      style={{
        zIndex: higher ? 500 : 40,
      }}
    >
      <div className="font-bold">Splitter</div>
    </div>
  );
}
