import { Handle, Position } from "reactflow";
import { itemFromId } from "../../hooks/useFullItem";
import { MCOrderNode } from "../../types/MCNodes";
import { RequirementView } from "../tasks/SideTaskBar";

interface OrderNodeProps {
  data: MCOrderNode;
}

export default function OrderNode({ data }: OrderNodeProps) {
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
                  // top: 50,
                  top: 0,
                  display: "block",
                  position: "relative",
                }}
              ></Handle>
              <RequirementView
                className="my-2 text-black"
                requirement={requirement}
              />
              <div>Pass</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
