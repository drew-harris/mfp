import { useNodeStore } from "../../stores/nodes";
import { MCResourceNode } from "../../types/MCNodes";
import { SpriteDisplay } from "../SpriteDisplay";
import { BaseNode } from "./BaseNode";
import { SideHandle } from "./nodeDetails/SideHandle";
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
    return Boolean(s.edges.some((edge) => edge.source === data.id));
  });

  return (
    <BaseNode
      rightSideNodes={
        <SideHandle isConnectable={!isOutputting} type="source" />
      }
      data={data}
    >
      <SpriteDisplay className="" size={56} url={data?.item?.imageUrl} />
      <div className="mb-3 text-xs">{data.item.title}</div>
      <input
        className="w-28 rounded-xl border border-black bg-gray-300 pl-4 text-xs text-black placeholder:text-gray-600"
        placeholder="Per-Second Rate"
        onChange={(event) =>
          setOutputRate(data.id, Number.parseInt(event.target.value) || 0)
        }
        value={outputRate || 0}
      />
      <div className="text-xs text-gray-400">/ Second</div>
    </BaseNode>
  );
}
