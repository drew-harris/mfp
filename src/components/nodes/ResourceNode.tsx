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

  const isOutputting = useNodeStore((s) => {
    return !!s.edges.find((edge) => edge.source === data.id);
  });

  return (
    <BaseNode data={data}>
      <SpriteDisplay className="" size={56} url={data?.item?.imageUrl} />
      <div className="mb-3 text-xs">{data.item.title}</div>
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
        isConnectable={!isOutputting}
        type="source"
        position={Position.Right}
        style={{ transform: "scale(2.6) translate(0px, -1.5px)" }}
      ></Handle>
    </BaseNode>
  );
}
