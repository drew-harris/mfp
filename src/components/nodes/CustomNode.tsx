import { faRightLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { itemFromId } from "../../hooks/useFullItem";
import { CustomRecipe } from "../../types/CustomNodes";
import { MCCustomNode, MCEdge } from "../../types/MCNodes";
import { SpriteDisplay } from "../SpriteDisplay";
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

  const collapsed = data.recipes
    .map((r) => r.inputs)
    .flatMap((r) => r.flat())
    // Remove duplicattes
    .filter((v, i, a) => a.findIndex((t) => t.itemId === v.itemId) === i);

  const leftSideNodes = collapsed.map((i) => (
    <SideHandle type="target" id={i.itemId} key={i.itemId} />
  ));

  const rightSideNodes = data.recipes.map((r) => (
    <SideHandle type="source" id={r.item.itemId} key={r.item.itemId} />
  ));

  return (
    <BaseNode
      rightSideNodes={rightSideNodes}
      leftSideNodes={leftSideNodes}
      data={data}
    >
      <a
        className="text-sm text-black/75"
        target="_blank"
        rel="noreferrer"
        href={`/edit/${data.lapisId}`}
      >
        Edit
      </a>
      <div className="flex items-stretch gap-5">
        <div className="flex flex-col justify-around">
          {collapsed.map((i) => (
            <div key={i.itemId}>
              <div className="text-center">{itemFromId(i.itemId).title}</div>
              <div className="text-center text-xs text-black/50">{i.num}</div>
              <SpriteDisplay url={itemFromId(i.itemId).imageUrl} />
            </div>
          ))}
        </div>
        <div className="grid place-items-center">
          <FontAwesomeIcon icon={faRightLong}></FontAwesomeIcon>
        </div>
        <div>
          {items.map((i) => (
            <div key={i.itemId}>
              <div className="text-center">{i.title}</div>
              <SpriteDisplay url={i.imageUrl} />
            </div>
          ))}
        </div>
      </div>
    </BaseNode>
  );
}

export { getResults as _testGetResults };
