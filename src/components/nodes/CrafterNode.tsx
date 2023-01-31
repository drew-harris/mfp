import { useMemo } from "react";
import { Handle, Position } from "reactflow";
import { allRecipes } from "../../hardcoded/recipes";
import { MCCrafterNode } from "../../types/MCNodes";
import { SpriteDisplay } from "../SpriteDisplay";
import { BaseNode } from "./BaseNode";

interface CrafterNodeProps {
  data: MCCrafterNode;
}

export default function CrafterNode({ data }: CrafterNodeProps) {
  const { recipes, minimumInputCount } = useMemo(() => {
    const recipes = allRecipes.filter(
      (r) => r.outputItemId === data.item.itemId
    );
    const minimumInputCount = Math.max(...recipes.map((r) => r.inputs.length));
    return {
      recipes,
      minimumInputCount,
    };
  }, [data.item]);

  const leftSide = (
    <div className="flex flex-col gap-16 mt-10">
      {[...Array(minimumInputCount)].map((v, i) => (
        <>
          <Handle
            style={{
              transform: `scale(2.6)`,
              top: 0,
              left: 0,
              display: "block",
              position: "relative",
            }}
            key={i}
            type={"target"}
            position={Position.Left}
          ></Handle>
        </>
      ))}
    </div>
  );

  return (
    <BaseNode leftSideNode={leftSide} innerClassName="" data={data}>
      <SpriteDisplay
        className="mb-5"
        size={56}
        spriteIndex={data.item.spriteIndex}
      />
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
