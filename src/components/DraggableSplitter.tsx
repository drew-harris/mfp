import { useDraggable } from "@dnd-kit/core";
import { DraggableItemData } from "../types/MCNodes";

export default function DraggableSplittter() {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: "splitter",
    data: { isItem: false, type: "splitter" } as DraggableItemData,
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
