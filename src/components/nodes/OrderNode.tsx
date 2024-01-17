import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Edge, Handle, Position } from "reactflow";
import { useNodeStore } from "../../stores/nodes";
import { MCEdge, MCOrderNode } from "../../types/MCNodes";
import { ItemRequirement } from "../../types/tasks";
import { RequirementView } from "../tasks/RequirementView";
import { BaseNode } from "./BaseNode";

interface OrderNodeProps {
  data: MCOrderNode;
}

export default function OrderNode({ data }: OrderNodeProps) {
  const incomingEdges = useNodeStore((store) =>
    store.edges.filter((edge) => edge.target === data.id)
  );

  return (
    <BaseNode data={data} innerClassName="py-0 px-0">
      <div className="m-0 p-0 text-black">
        {data.task.itemRequirements?.map((requirement) => (
          <div className="flex items-center gap-3" key={requirement.itemId}>
            <Handle
              key={requirement.itemId}
              id={requirement.itemId.toString()}
              type="target"
              position={Position.Left}
              style={{
                transform: `scale(2.6)`,
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
    </BaseNode>
  );
}

function doesEdgePassRequirement(
  edge: Edge<MCEdge> | undefined,
  requirement: ItemRequirement
) {
  if (!edge || !edge.data || !edge.data?.outputRate) {
    return false;
  }
  if (edge.data?.outputRate < requirement.rate) {
    return false;
  }
  return true;
}
