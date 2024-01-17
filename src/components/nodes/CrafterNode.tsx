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
import pluralize from "pluralize";

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
  const setResourceOutputRate = useNodeStore((s) => s.setResourceOutputRate);
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

  const inputAmounts = selectedRecipe.inputs.map((input) => {
    const edge = inboundEdges.find(
      (e) => e.data?.item.itemId === input.itemId
    );
    if (!edge) {
      return {
        itemId: input.itemId,
        amount: 0,
        itemTitle: input.itemId,
        recipeAmount: input.amount
      };
    }
    return {
      itemId: edge.data.item.itemId,
      amount: edge.data.outputRate ?? 0,
      itemTitle: edge.data.item.title.toLowerCase(),
      recipeAmount: input.amount
    }
  });

  const numSets = selectedRecipe.inputs.map((input) => {
    const inboundEdge = inboundEdges.find(
      (e) => e.data?.item.itemId === input.itemId
    );
    if (inboundEdge?.data?.outputRate) {
      return Math.floor(inboundEdge.data?.outputRate / input.amount);
    }
    return 0;
  });

  const minSet = Math.min(...numSets);

  const leftovers = inputAmounts.map((input) => {
    return {
      itemId: input.itemId,
      amount: minSet ? input.amount - (minSet * input.recipeAmount) : input.amount,
      itemTitle: input.itemTitle,
    };
  });

  useEffect(() => {
    // console.log(`OUTPUT SETS: ${selectedRecipe.outputItemId}: ${numSets}`);
    const outputRate = minSet * selectedRecipe.outputAmount;

    //console.log("leftovers: " + leftovers.map(item => `itemId: ${item.itemId}, amount: ${item.amount}, itemTitle: ${item.itemTitle}`).join(', '));

    setIsWastingMaterial( isOutputting && leftovers.some((left) => left.amount !== 0));

    // console.log(`${selectedRecipe.outputItemId}: ${outputRate}`);

    setResourceOutputRate(data.id, outputRate);
  }, [
    inboundEdges,
    outboundEdges,
    selectedRecipe,
    data.id,
    setResourceOutputRate,
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

  //todo: change format if item name ends in s
  const leftoversTextArr = leftovers
    .filter((left) => left.amount > 0)
    .map((left) => `${left.amount} ${pluralize(left.itemTitle, left.amount)}`);

  const minLeftover =
    leftovers.length > 0
      ? // eslint-disable-next-line unicorn/no-array-reduce
        leftovers.reduce(
          (min, left) => (left.amount < min.amount ? left : min),
          leftovers[0]
        )
      : null;

  const leftoversText = (() => {
    const arrLength = leftoversTextArr.length;
    switch (arrLength) {
      case 0: {
        return "ERROR"; //todo: replace value for something better
      }
      case 1: {
        return leftoversTextArr[0];
      }
      case 2: {
        return leftoversTextArr.join(" and ");
      }
      default: {
        console.log("before pop: " + leftoversTextArr);
        const lastItem = leftoversTextArr.pop();
        console.log("before pop: " + leftoversTextArr);
        return `${leftoversTextArr.join(", ")}, and ${lastItem}`;
      }
    }
  })();

  const leftoversSum = leftovers.reduce((acc, curr) => {
    return acc + curr.amount;
  }, 0);

  const totalSum = inputAmounts.reduce((acc, curr) => {
    return acc + curr.amount;
  }, 0);

  const efficiency = 1 - (leftoversSum / totalSum);

  return (
    <BaseNode
      //outerClassName={isWastingMaterial ? "border-red-500" : null}
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
      {isWastingMaterial && isOutputting && (outboundEdges[0].data.outputRate === 0) && (
        <div className="text-xs text-red-800">
          This node produces nothing.
        </div>
      )}
      {infoModeEnabled && isWastingMaterial && (selectedRecipe.inputs.length > 1) && minLeftover &&
        !inputAmounts.some((input) => { return input.amount === 0; }) && (
          <div className="whitespace-pre-wrap text-xs">
            Bottlenecked by {minLeftover.itemTitle}.
          </div>
      )}
      {infoModeEnabled && (
        <div>
          <div>Sets: {minSet || 0}</div>
          <div>
            Efficiency: {efficiency ? Math.round(efficiency * 100) : 0}%
          </div>
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
        </div>
        {/*Length is arbitrary*/}
      </div>
    </div>
  );
};
