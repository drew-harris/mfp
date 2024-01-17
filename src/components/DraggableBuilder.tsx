import { useDraggable } from "@dnd-kit/core";
import { faGears, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePickerFilterStore } from "../stores/pickerFilterStore";
import { DraggableBuilder, DraggableType, MCNodeType } from "../types/MCNodes";
import { cva } from "cva";

interface DraggableBuilderProps {
  higher?: boolean;
}

// TODO: Merge with draggable builder and splitter
export default function DraggableBuilderSquare({
  higher = false,
}: DraggableBuilderProps) {
  const enabled = usePickerFilterStore(
    (s) => s.switches["Utility"] || s.switches["All Nodes"]
  );
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: "builder",
    data: {
      type: MCNodeType.builder,
      draggableType: DraggableType.builder,
    } as DraggableBuilder,
  });

  if (!enabled) return null;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="outset flex flex-col items-center justify-between bg-purple-300 p-3"
      style={{
        zIndex: higher ? 500 : 40,
      }}
    >
      <div className="text-xs">Utility</div>
      <FontAwesomeIcon icon={faGears} size="2x" />
      <div className="text-center font-bold">Node Builder</div>
    </div>
  );
}
