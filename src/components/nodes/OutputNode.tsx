import { Handle, Position } from "reactflow";
import { MCOutputNode } from "../../types/MCNodes";

interface OutputNodeProps {
  data: MCOutputNode;
}

export default function OutputNode({ data }: OutputNodeProps) {
  return (
    <>
      <div className="p-3 bg-mc-500 border-4 shadow border-mc-200 text-white flex flex-col gap-2 items-center">
        <div>{data.title}</div>
        {data.imageUrl ? <img src={data.imageUrl}></img> : null}
        <div className="text-xs">Output Rate</div>
        <Handle
          type="target"
          position={Position.Left}
          style={{ transform: "scale(2.6)" }}
        ></Handle>
      </div>
    </>
  );
}
