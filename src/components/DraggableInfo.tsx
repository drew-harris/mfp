import { useDraggable } from "@dnd-kit/core";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DraggableInfo, DraggableType, MCNodeType } from "../types/MCNodes";

interface DraggableInfoProps {
  higher?: boolean;
}

export default function DraggableInfoSquare({
  higher = false,
}: DraggableInfoProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: "info",
    data: {
      type: MCNodeType.info,
      draggableType: DraggableType.info,
    } as DraggableInfo,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="flex flex-col items-center justify-between p-3 outset bg-mc-100"
      style={{
        zIndex: higher ? 500 : 40,
      }}
    >
      <div className="text-xs">Utility</div>
      <FontAwesomeIcon icon={faMagnifyingGlass} size="2x" />
      <div className="font-bold text-center">Info</div>
    </div>
  );
}
