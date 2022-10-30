import { Handle, Position } from "reactflow";
import { MCNode } from "../../types/MCNodes";
import { SpriteDisplay } from "../SpriteDisplay";
interface ResourceNodeProps {
  data: MCNode;
}

export default function ResourceNode({ data }: ResourceNodeProps) {
  return (
    <>
      <div className="p-1 bg-lime-500 border-4 shadow border-mc-200 text-white">
        <div className="text-black text-center">Resource</div>
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
            type="source"
            position={Position.Right}
            style={{ transform: "scale(2.6) translate(0px, -1.5px)" }}
          >
            <div
              className="text-[4px] -translate-x-2 -translate-y-[1.2px]"
              style={{ direction: "rtl" }}
            >
              {data.title}
            </div>
          </Handle>
        </div>
      </div>
    </>
  );
}
