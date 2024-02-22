import { faRightLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { itemFromId } from "../../hooks/useFullItem";
import { CustomRecipe } from "../../types/CustomNodes";
import { MCCustomNode, MCEdge } from "../../types/MCNodes";
import { SpriteDisplay } from "../SpriteDisplay";
import { BaseNode } from "./BaseNode";
import { SideHandle } from "./nodeDetails/SideHandle";
import { useEffect } from "react";
import { useNodeStore } from "../../stores/nodes";

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
        minGroup = 0;
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
    // Remove duplicates
    .filter((v, i, a) => a.findIndex((t) => t.itemId === v.itemId) === i);

  const inputEdges = useNodeStore((s) => {
    return s.edges
      .filter((edge) => edge.target === data.id);
  });

  const outputEdges = useNodeStore((s) => {
    return s.edges
      .filter((edge) => edge.source === data.id);
  });

  const setEdgeData = useNodeStore((s) => s.setEdgeData);

  useEffect(() => {
    const result = getResults(inputEdges.map((edge) => edge.data), data.recipes);

    for (const output of outputEdges) {
      const numSets = result.find((r) => r.itemId === output.data.item.itemId);
      setEdgeData(output.id, {
        outputRate: numSets?.amount || 0,
        item: output.data.item,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputEdges.length, outputEdges.length, inputEdges.map((e) => e.data).map((e) => e.outputRate).join(',')]);

  const leftSideNodes = collapsed.map((i) => (
    <SideHandle type="target" id={i.itemId} key={i.itemId} />
  ));

  const rightSideNodes = data.recipes.map((r) => {
    // console.log("source:", r.item.title)
    return <SideHandle type="source" id={r.item.itemId} key={r.item.itemId} />
  });

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
      <div>{}</div>
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
              <div className="text-center text-xs text-black/50"></div>
              <SpriteDisplay url={i.imageUrl} />
            </div>
          ))}
        </div>
      </div>
    </BaseNode>
  );
}

export { getResults as _testGetResults };
