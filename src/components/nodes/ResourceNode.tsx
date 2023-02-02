import { Handle, Position } from "reactflow";
import { useNodeStore } from "../../stores/nodes";
import { MCResourceNode } from "../../types/MCNodes";
import { SpriteDisplay } from "../SpriteDisplay";
import { BaseNode } from "./BaseNode";
interface ResourceNodeProps {
  data: MCResourceNode;
}

export default function ResourceNode({ data }: ResourceNodeProps) {
  const setOutputRate = useNodeStore((store) => store.setResourceOutputRate);

  const outputRate = useNodeStore(
    (store) =>
      store.edges.find((edge) => edge.source === data.id)?.data?.outputRate || 0
  );

  return (
    <BaseNode data={data}>
      <SpriteDisplay
        className="mb-5"
        size={56}
        spriteIndex={data?.item?.spriteIndex || 0}
      />
      <input
        className="pl-4 w-28 text-xs text-black bg-gray-300 rounded-xl border border-black placeholder:text-gray-600"
        placeholder="Per-Hour Rate"
        onChange={(event) =>
          setOutputRate(data.id, parseInt(event.target.value) || 0)
        }
        value={outputRate || 0}
      />
      <div className="text-xs text-gray-400">/ Hour</div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ transform: "scale(2.6) translate(0px, -1.5px)" }}
      >
        <div
          className="-translate-x-2 text-[4px] -translate-y-[1.2px]"
          style={{ direction: "rtl" }}
        >
          {data?.item?.title}
        </div>
      </Handle>
    </BaseNode>
  );
}
