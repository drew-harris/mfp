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
              <RequirementView
                className="my-2 text-black"
                requirement={requirement}
              />
              <div>Pass</div>
            </div>
          ))}
        </div>
        {data.task.itemRequirements?.map((req, index) => (
          <Handle
            key={req.itemId}
            id={req.itemId.toString()}
            type="target"
            position={Position.Left}
            style={{
              transform: `scale(2.6) translate(0px, ${index * 16 - 20}px)`,
            }}
          >
            <div
              className="-translate-x-2 text-[4px] -translate-y-[1.2px]"
              style={{ direction: "rtl" }}
            >
              {itemFromId(req.itemId).title}
            </div>
          </Handle>
        ))}
      </div>
    </>
  );
}
