import { useDraggable } from "@dnd-kit/core";
import { DraggableData } from "../types/MCNodes";

export default function DraggableSplittter() {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "splitter",
    data: { isItem: false, type: "splitter" } as DraggableData,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`border-4 bg-red-500 z-50 flex flex-col items-center border-mc-700 p-3`}
    >
      <div>Splitter</div>
    </div>
  );
}
