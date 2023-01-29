import { Handle, Position } from "reactflow";
import { MCCrafterNode } from "../../types/MCNodes";
import { SpriteDisplay } from "../SpriteDisplay";
import { BaseNode } from "./BaseNode";

interface CrafterNodeProps {
  data: MCCrafterNode;
}

export default function CrafterNode({ data }: CrafterNodeProps) {
  return (
    <BaseNode data={data}>
      <SpriteDisplay
        className="mb-5"
        size={56}
        spriteIndex={data.item.spriteIndex}
      />
      <div className="text-xs text-gray-400">/ Hour</div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ transform: "scale(2.6) translate(0px, -1.5px)" }}
      >
        <div className="translate-x-2 text-[4px] -translate-y-[1.2px]">
          {data.item.title}
        </div>
      </Handle>
    </BaseNode>
  );
}
