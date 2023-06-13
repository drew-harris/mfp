import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useOnSelectionChange } from "reactflow";
import { useNodeStore } from "../../stores/nodes";

type SelectionType = "node" | "edge" | null;

export default function DeleteButton() {
  const [selected, setSelected] = useState(null);
  const [selectedType, setSelectedType] = useState<SelectionType>(null);
  const [deleteNode, deleteEdge] = useNodeStore((s) => {
    return [s.removeNodeById, s.removeEdgeById];
  });

  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      const selectedNode = nodes.find((n) => n.selected);
      if (selectedNode) {
        setSelected(selectedNode?.id);
        setSelectedType("node");
        return;
      } else {
        const selectedEdge = edges.find((e) => e.selected);
        if (selectedEdge) {
          setSelected(selectedEdge?.id);
          setSelectedType("edge");
          return;
        }

        setSelected(null);
        setSelectedType(null);
      }
    },
  });

  const handleDelete = () => {
    if (selectedType === "node") {
      deleteNode(selected);
    } else if (selectedType === "edge") {
      deleteEdge(selected);
    }

    setSelected(null);
    setSelectedType(null);
  };

  if (!selected) return null;

  return (
    <div
      onClick={handleDelete}
      className="outset-4 bg-mc-300 p-2 px-3  active:inset-4 "
    >
      <FontAwesomeIcon icon={faTrash} />
    </div>
  );
}
