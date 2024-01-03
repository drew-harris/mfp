import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";
import { Handle, Position, useUpdateNodeInternals } from "reactflow";
import { allRecipes } from "../../hardcoded/recipes";
import { useFullItem } from "../../hooks/useFullItem";
import { useSetNodeData } from "../../hooks/useSetNodeData";
import { useNodeStore } from "../../stores/nodes";
import { MCCrafterNode, Recipe } from "../../types/MCNodes";
import { edgeArrayUpdate } from "../../utils/updates";
import { SpriteDisplay } from "../SpriteDisplay";
import { BaseNode } from "./BaseNode";
import { RecipeSelector } from "./nodeDetails/RecipeSelector";

interface CrafterNodeProps {
  data: MCCrafterNode;
}

export default function CrafterNode({ data }: CrafterNodeProps) {
  const recipes = useMemo(() => {
    return allRecipes.filter((r) => r.outputItemId === data.item.itemId);
  }, [data.item]);

  const infoModeEnabled = useNodeStore((s) => s.infoModeEnabled);

  const [isWastingMaterial, setIsWastingMaterial] = useState(false);

  const updateNodeInternals = useUpdateNodeInternals();
  const setResouceOutputRate = useNodeStore((s) => s.setResourceOutputRate);
  const removeEdge = useNodeStore((s) => s.removeEdgeById);

  const inboundEdges = useNodeStore((s) => {
    return s.edges.filter((e) => e.target === data.id);
  }, edgeArrayUpdate);

  const outboundEdges = useNodeStore((s) => {
    return s.edges.filter((e) => e.source === data.id);
  }, edgeArrayUpdate);

  const setNodeData = useSetNodeData<MCCrafterNode>(data.id);
  const setSelectedRecipe = (recipe: Recipe) => {
    setNodeData({ recipeIndex: recipes.indexOf(recipe) });
  };

  const selectedRecipe = recipes[data.recipeIndex];

  const isOutputting = useNodeStore((s) => {
    return Boolean(s.edges.some((edge) => edge.source === data.id));
  });

  useEffect(() => {
    const numSets = selectedRecipe.inputs.map((input) => {
      const inboundEdge = inboundEdges.find(
        (e) => e.data?.item.itemId === input.itemId
      );
      if (inboundEdge?.data?.outputRate) {
        return inboundEdge.data?.outputRate / input.amount;
      }
      return 0;
    });

    console.log(`OUTPUT SETS: ${selectedRecipe.outputItemId}: ${numSets}`);

    const minSet = Math.min(...numSets);
    let outputRate = minSet * selectedRecipe.outputAmount;

    // TODO: Rescope for terrible inputs too
    setIsWastingMaterial(numSets.some((set) => set !== minSet));

    outputRate = Math.floor(outputRate);
    console.log(`${selectedRecipe.outputItemId}: ${outputRate}`);

    setResouceOutputRate(data.id, outputRate);
  }, [
    inboundEdges,
    outboundEdges,
    selectedRecipe,
    data.id,
    setResouceOutputRate,
  ]);

  useEffect(() => {
    for (const edge of inboundEdges) {
      const input = selectedRecipe.inputs.find(
        (i) => i.itemId === edge.data?.item.itemId
      );
      if (!input) {
        removeEdge(edge.id);
      }
    }
    updateNodeInternals(data.id);
  }, [selectedRecipe, data.id, inboundEdges, removeEdge, updateNodeInternals]);

  const outputSets =
    outboundEdges[0]?.data.outputRate / selectedRecipe.outputAmount;

  const leftovers = inboundEdges.flatMap((edge) => {
    const input = selectedRecipe.inputs.find(
      (i) => i.itemId === edge.data?.item.itemId
    );
    if (!input) {
      return [];
    }
    return [
      {
        itemId: edge.data.item.itemId,
        amount: edge.data.outputRate - input.amount * outputSets,
        itemTitle: edge.data.item.title.toLowerCase(),
      },
    ];
  });

  const leftoversSum = leftovers.reduce((acc, curr) => {
    return acc + curr.amount;
  }, 0);

  //todo: change format if item name ends in s
  const leftoversTextArr = leftovers
    .filter((left) => left.amount > 0)
    .map((left) => `${left.amount} ${left.itemTitle}s`);

  // eslint-disable-next-line unicorn/no-array-reduce
  const minLeftover = leftovers.reduce(
    (min, left) => (left.amount < min.amount ? left : min),
    leftovers[0]
  );

  const leftoversText = (() => {
    if (leftoversTextArr.length === 1) {
      return leftoversTextArr[0];
    }
    if (leftoversTextArr.length === 2) {
      return leftoversTextArr.join(" and ");
    }
    const lastItem = leftoversTextArr.pop();
    return `${leftoversTextArr.join(", ")}, and ${lastItem}`;
  })();

  const efficiency = outputSets / (outputSets + leftoversSum);

  return (
    <BaseNode
      outerClassName={isWastingMaterial ? "border-red-500" : null}
      innerClassName="px-0 py-3"
      data={data}
    >
      <RecipeSelector
        recipes={recipes}
        selectedRecipe={selectedRecipe}
        setSelectedRecipe={setSelectedRecipe}
      />
      <div className="flex items-center gap-3">
        <div>
          {selectedRecipe.inputs.map((input) => (
            <CrafterInput input={input} key={input.itemId} />
          ))}
        </div>
        <FontAwesomeIcon className="ml-4" icon={faArrowRight} />
        <div className="flex items-center gap-3 pl-3">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3">
              <SpriteDisplay url={data.item.imageUrl} />
              <div>x {selectedRecipe.outputAmount}</div>
            </div>
            <div className="text-xs text-gray-500">{data.item.title}</div>
          </div>
          <Handle
            isConnectable={!isOutputting}
            style={{
              transform: `scale(2.6) translate(0px, 0px)`,
              top: 0,
              display: "block",
              position: "relative",
            }}
            type="source"
            position={Position.Right}
          />
        </div>
      </div>
      {isWastingMaterial && (
        <div className="text-xs text-red-800">
          You are wasting {leftoversText}!
        </div>
      )}
      {isWastingMaterial && infoModeEnabled && minLeftover && (
        <div className="text-xs">Bottlenecked by {minLeftover.itemTitle}s.</div>
      )}
      {infoModeEnabled && (
        <div>
          <div>Sets: {outputSets}</div>
          <div>Efficiency: {Math.round(efficiency * 100)}%</div>
        </div>
      )}
    </BaseNode>
  );
}

const CrafterInput = ({
  input,
}: {
  input: {
    itemId: string;
    amount: number;
  };
}) => {
  const item = useFullItem(input.itemId);
  return (
    <div className="my-2 flex items-center gap-3">
      <Handle
        type="target"
        id={input.itemId.toString()}
        position={Position.Left}
        style={{
          transform: `scale(2.6) translate(0px, 0px)`,
          top: 0,
          display: "block",
          position: "relative",
        }}
      />
      <div>
        <div className="flex items-center gap-2">
          <SpriteDisplay url={item.imageUrl} />x {input.amount}
        </div>
        <div className="w-20 text-center text-xs text-gray-500">
          {item.title}
        </div>{" "}
        {/*Length is arbitrary*/}
      </div>
    </div>
  );
};
