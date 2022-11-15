import { Handle, Position } from "reactflow";
import { MCOutputNode } from "../../types/MCNodes";
import { SpriteDisplay } from "../SpriteDisplay";

interface OutputNodeProps {
  data: MCOutputNode;
}

export default function OutputNode({ data }: OutputNodeProps) {
  return (
    <>
      <div className="p-1 bg-cyan-300  shadow  text-white">
        <div className="text-black text-center">Output</div>
        <div className="bg-gray-100 px-8 py-4  text-black flex items-center flex-col">
          <SpriteDisplay
            className="mb-5"
            size={56}
            spriteIndex={data.spriteIndex}
          />
          <input
            className="w-28 border text-xs pl-4 text-black placeholder:text-gray-600 bg-gray-300 border-black rounded-xl"
            placeholder="Per-Hour Rate"
          />
          <div className="text-gray-400 text-xs">/ Hour</div>
          <Handle
            type="target"
            position={Position.Left}
            style={{ transform: "scale(2.6) translate(0px, -1.5px)" }}
          >
            <div className="text-[4px] translate-x-2 -translate-y-[1.2px]">
              {data.title}
            </div>
          </Handle>
        </div>
      </div>
    </>
  );
}
