import { useEffect } from "react";
import { useSetNodeData } from "../../hooks/useSetNodeData";
import { useNodeStore } from "../../stores/nodes";
import { MCResourceNode } from "../../types/MCNodes";
import { SpriteDisplay } from "../SpriteDisplay";
import { BaseNode } from "./BaseNode";
import { SideHandle } from "./nodeDetails/SideHandle";
interface ResourceNodeProps {
  data: MCResourceNode;
}

export default function ResourceNode({ data }: ResourceNodeProps) {
  const setData = useSetNodeData<MCResourceNode>(data.id);

  const setOutputRate = useNodeStore((store) => store.setResourceOutputRate);

  const isOutputting = useNodeStore((s) => {
    return Boolean(s.edges.some((edge) => edge.source === data.id));
  });

  const outputRate = Number.parseInt(data.inputString) || 0;

  // Sets edge rate when connected
  useEffect(() => {
    setOutputRate(data.id, outputRate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOutputting, data.inputString]);

  return (
    <BaseNode
      rightSideNodes={
        <SideHandle isConnectable={!isOutputting} type="source" />
      }
      data={data}
    >
      <SpriteDisplay className="" size={56} url={data?.item?.imageUrl} />
      <div className="mb-3 text-xs">{data.item.title}</div>
      <>
        <input
          className="w-28 rounded-xl border border-black bg-gray-300 pl-4 text-xs text-black placeholder:text-gray-400"
          placeholder="Enter amount..."
          onChange={(event) => {
            //const inputValue = event.target.value;
            setData({ inputString: event.target.value.replace(/\D/g, "") });
            setOutputRate(data.id, outputRate || 0);
          }}
          value={data.inputString}
        />
        <div className="text-xs text-gray-400">/ Minute</div>
      </>
    </BaseNode>
  );
}
