import { useDraggable } from "@dnd-kit/core";
import { faArrowsSplitUpAndLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
      className="flex flex-col justify-between items-center p-3 border-4 bg-yellow-200 outset"
      style={{
        zIndex: higher ? 500 : 40,
      }}
    >
      <div className="text-xs">Utility</div>
      <FontAwesomeIcon icon={faArrowsSplitUpAndLeft} size="2x" />
      <div className="font-bold text-center">Splitter</div>
    </div>
  );
}
