import { Handle, Position } from "reactflow";
import { useStore } from "zustand";
import { nodeStore } from "../../stores/nodes";
import { MCOutputNode } from "../../types/MCNodes";
import { SpriteDisplay } from "../SpriteDisplay";

interface OutputNodeProps {
  data: MCOutputNode;
}

export default function OutputNode({ data }: OutputNodeProps) {
  const outputRate = useStore(
    nodeStore,
    (state) =>
      state.edges.find((edge) => edge.target === data.id)?.data?.outputRate
  );

  return (
    <>
      <div className="p-1 text-white bg-cyan-300 shadow">
        <div className="text-center text-black">Output</div>
        <div className="flex flex-col items-center py-4 px-8 text-black bg-gray-100">
          <SpriteDisplay
            className="mb-5"
            size={56}
            spriteIndex={data.item.spriteIndex}
          />
          <input
            className="pl-4 w-28 text-xs text-black bg-gray-300 rounded-xl border border-black placeholder:text-gray-600"
            placeholder="Per-Hour Rate"
            value={outputRate}
          />
          <div className="text-xs text-gray-400">/ Hour</div>
          <Handle
            type="target"
            position={Position.Left}
            style={{ transform: "scale(2.6) translate(0px, -1.5px)" }}
          >
            <div className="translate-x-2 text-[4px] -translate-y-[1.2px]">
              {data.item.title}
            </div>
          </Handle>
        </div>
      </div>
    </>
  );
}
