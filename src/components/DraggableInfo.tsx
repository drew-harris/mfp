import { useDraggable } from "@dnd-kit/core";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePickerFilterStore } from "../stores/pickerFilterStore";
import { DraggableInfo, DraggableType, MCNodeType } from "../types/MCNodes";

interface DraggableInfoProps {
  higher?: boolean;
}

export default function DraggableInfoSquare({
  higher = false,
}: DraggableInfoProps) {
  const enabled = usePickerFilterStore(
    (s) => s.switches["Utility"] || s.switches["All Nodes"]
  );
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: "info",
    data: {
      type: MCNodeType.info,
      draggableType: DraggableType.info,
    } as DraggableInfo,
  });

  if (!enabled) return null;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="outset flex flex-col items-center justify-between bg-mc-100 p-3"
      style={{
        zIndex: higher ? 500 : 40,
      }}
    >
      <div className="text-xs">Utility</div>
      <FontAwesomeIcon icon={faMagnifyingGlass} size="2x" />
      <div className="text-center font-bold">Info</div>
    </div>
  );
}
