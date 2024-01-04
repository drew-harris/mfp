/* eslint-disable no-undefined */
import { useEffect, useState } from "react";
import { itemFromId } from "../../hooks/useFullItem";
import { useNodeStore } from "../../stores/nodes";
import { CustomRecipe } from "../../types/CustomNodes";
import { MCCustomNode, MCEdge } from "../../types/MCNodes";
import { SpriteDisplay } from "../SpriteDisplay";
import { Button } from "../basic/Button";
import { BaseNode } from "./BaseNode";
import { SideHandle } from "./nodeDetails/SideHandle";

interface CustomNodeProps {
  data: MCCustomNode;
}

export interface CustomNodeResult {
  itemId: string;
  amount: number;
}
function getResults(
  inputEdges: MCEdge[],
  recipes: CustomRecipe[]
): CustomNodeResult[] {
  if (!recipes) {
    return [];
  }

  const result: CustomNodeResult[] = [];
  for (const recipe of recipes) {
    let minGroup = 9_999_999;
    for (const input of recipe.inputs) {
      const found = inputEdges.find((e) => e.item.itemId === input.itemId);
      if (!found) {
        break;
      }

      const sets = Math.floor(found.outputRate / input.num);
      if (sets < 1) {
        break;
      }
      if (sets < minGroup) {
        minGroup = sets;
      }
    }
    // Search for the incoming edge
    if (minGroup !== 9_999_999) {
      result.push({
        itemId: recipe.item.itemId,
        amount: minGroup,
      });
    }
  }
  return result;
}

export default function CustomNode({ data }: CustomNodeProps) {
  const items = data.recipes.map((r) => r.item);
  const [showRequired, setShowRequired] = useState(false);
  const incomingEdges = useNodeStore((s) =>
    s.edges.filter((e) => e.target === data.id)
  ).map((e) => e.data);

  const collapsed = data.recipes.map((r) => r.inputs).flatMap((r) => r.flat());

  const leftSideNodes = collapsed.map((i) => (
    <SideHandle type="target" id={`${data.id}-input-${i}`} key={i.itemId} />
  ));

  useEffect(() => {
    console.log(data.recipes);
  }, [incomingEdges]);

  return (
    <BaseNode leftSideNodes={leftSideNodes} data={data}>
      {items.map((i) => (
        <div key={i.itemId}>
          <div>{i.title}</div>
          <SpriteDisplay url={i.imageUrl} />
        </div>
      ))}
      <Button className="my-2" onClick={() => setShowRequired((s) => !s)}>
        Toggle requirements (DEBUG)
      </Button>
      {showRequired && (
        <>
          <div className="my-10">Requires</div>
          {collapsed.map((i) => {
            const item = itemFromId(i.itemId);
            return (
              <div key={i.itemId}>
                <div>{item.title}</div>
                <SpriteDisplay url={item.imageUrl} />
              </div>
            );
          })}
        </>
      )}
    </BaseNode>
  );
}

export { getResults as _testGetResults };
