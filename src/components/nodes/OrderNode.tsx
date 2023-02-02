import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Edge, Handle, Position } from "reactflow";
import { useNodeStore } from "../../stores/nodes";
import { MCEdge, MCOrderNode } from "../../types/MCNodes";
import { ItemRequirement } from "../../types/tasks";
import { RequirementView } from "../tasks/SideTaskBar";

interface OrderNodeProps {
  data: MCOrderNode;
}

export default function OrderNode({ data }: OrderNodeProps) {
  const incomingEdges = useNodeStore((store) =>
    store.edges.filter((edge) => edge.target === data.id)
  );

  return (
    <>
      <div className="p-1 text-white bg-orange-300 shadow">
        <div className="text-center text-black">Order</div>
        <div className="p-2 text-black bg-white">
          {data.task.itemRequirements?.map((requirement) => (
            <div className="flex gap-3 items-center" key={requirement.itemId}>
              <Handle
                key={requirement.itemId}
                id={requirement.itemId.toString()}
                type="target"
                position={Position.Left}
                style={{
                  transform: `scale(2.6) translate(-4px, ${0}px)`,
                  top: 0,
                  display: "block",
                  position: "relative",
                }}
              ></Handle>
              <RequirementView
                className="m-2 text-black"
                requirement={requirement}
              />
              <div className="mx-3">
                {doesEdgePassRequirement(
                  incomingEdges.find(
                    (edge) => edge.data?.item.itemId === requirement.itemId
                  ),
                  requirement
                ) ? (
                  <FontAwesomeIcon icon={faCheck} color="green" />
                ) : (
                  <FontAwesomeIcon icon={faX} color="red" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function doesEdgePassRequirement(
  edge: Edge<MCEdge> | undefined,
  requirement: ItemRequirement
) {
  if (!edge || !edge.data || !edge.data?.outputRate) {
    return false;
  }
  if (edge.data?.outputRate < requirement.perHour) {
    return false;
  }
  return true;
}
