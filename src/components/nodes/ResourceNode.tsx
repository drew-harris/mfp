import { Handle, Position } from "reactflow";
import { MCNode } from "../../types/MCNodes";

interface ResourceNodeProps {
  data: MCNode;
}

export default function ResourceNode({ data }: ResourceNodeProps) {
  return (
    <>
      <div className="p-3 bg-mc-500 text-white flex flex-col gap-3 items-center">
        <div>{data.title}</div>
        {data.imageUrl ? <img src={data.imageUrl}></img> : null}
      </div>
      <Handle type="source" position={Position.Bottom}></Handle>
    </>
  );
}
