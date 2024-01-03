import { useNodeStore } from "../../stores/nodes";
import { MCResourceNode, MCSplitterNode } from "../../types/MCNodes";
import { SpriteDisplay } from "../SpriteDisplay";
import { BaseNode } from "./BaseNode";
import { SideHandle } from "./nodeDetails/SideHandle";
import { useSetNodeData } from "../../hooks/useSetNodeData";
import { useEffect } from "react";
import { getRatioFromInputString } from "./SplitterNode";
interface ResourceNodeProps {
  data: MCResourceNode;
}

export default function ResourceNode({ data }: ResourceNodeProps) {
  const setData = useSetNodeData<MCResourceNode>(data.id);

  const setOutputRate = useNodeStore((store) => store.setResourceOutputRate);

  const isOutputting = useNodeStore((s) => {
    return Boolean(s.edges.some((edge) => edge.source === data.id));
  });

  useEffect(() => {
    setOutputRate(data.id, data.outputRate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOutputting]);

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
            const inputValue = Number.parseInt(event.target.value);
            setData({ outputRate: inputValue || 0 });
            setOutputRate(data.id, inputValue || 0);
          }}
          value={data.outputRate}
        />
        <div className="text-xs text-gray-400">/ Minute</div>
      </>
    </BaseNode>
  );
}
