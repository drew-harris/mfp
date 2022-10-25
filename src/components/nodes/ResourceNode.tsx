import { Handle, Position } from "reactflow";
import { MCNode } from "../../types/MCNodes";

interface ResourceNodeProps {
  data: MCNode;
}

export default function ResourceNode({ data }: ResourceNodeProps) {
  return (
    <>
      <div className="p-3 bg-mc-500 border-4 shadow border-mc-200 text-white flex flex-col gap-2 items-center">
        <div>{data.title}</div>
        {data.imageUrl ? <img src={data.imageUrl}></img> : null}
        <div className="text-xs">Output Rate</div>
        <input type={"number"} className="text-black w-3/5 text-center" />
        <Handle
          type="source"
          position={Position.Right}
          style={{ transform: "scale(2.6)" }}
        ></Handle>
      </div>
    </>
  );
}
