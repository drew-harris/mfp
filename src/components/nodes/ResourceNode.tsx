import { Handle, Position } from "reactflow";
import { useStore } from "zustand";
import { nodeStore } from "../../stores/nodes";
import { MCNode } from "../../types/MCNodes";
import { SpriteDisplay } from "../SpriteDisplay";
interface ResourceNodeProps {
  data: MCNode;
}

export default function ResourceNode({ data }: ResourceNodeProps) {
  const setOutputRate = useStore(
    nodeStore,
    (store) => store.setResourceOutputRate
  );

  const outputRate = useStore(
    nodeStore,
    (store) =>
      store.edges.find((edge) => edge.source === data.id)?.data?.outputRate
  );
  return (
    <>
      <div className="p-1 text-white bg-lime-500 shadow">
        <div className="text-center text-black">Resource</div>
        <div className="flex flex-col items-center py-4 px-8 text-black bg-gray-100">
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
            value={outputRate}
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
        </div>
      </div>
    </>
  );
}
