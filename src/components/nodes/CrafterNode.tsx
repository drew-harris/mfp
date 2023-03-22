import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo } from "react";
import { Edge, Handle, Position, useUpdateNodeInternals } from "reactflow";
import { allRecipes } from "../../hardcoded/recipes";
import { useFullItem } from "../../hooks/useFullItem";
import { useNodeStore } from "../../stores/nodes";
import { MCCrafterNode, MCEdge, MCNodeType, Recipe } from "../../types/MCNodes";
import { SpriteDisplay } from "../SpriteDisplay";
import { BaseNode } from "./BaseNode";
import { RecipeSelector } from "./nodeDetails/RecipeSelector";

interface CrafterNodeProps {
  data: MCCrafterNode;
}

const actualEdgeUpdate = (
  oldEdges: Edge<MCEdge>[],
  newEdges: Edge<MCEdge>[]
): boolean => {
  const datas = oldEdges.map((e) => e.data);
  const newDatas = newEdges.map((e) => e.data);

  if (datas.length !== newDatas.length) {
    return false;
  }

  for (let i = 0; i < datas.length; i++) {
    if (datas[i]?.item.itemId !== newDatas[i]?.item.itemId) {
      return false;
    }
    if (datas[i]?.outputRate !== newDatas[i]?.outputRate) {
      return false;
    }
  }

  return true;
};

export default function CrafterNode({ data }: CrafterNodeProps) {
  const recipes = useMemo(() => {
    return allRecipes.filter((r) => r.outputItemId === data.item.itemId);
  }, [data.item]);

  const updateNodeInternals = useUpdateNodeInternals();
  const setResouceOutputRate = useNodeStore((s) => s.setResourceOutputRate);
  const removeEdge = useNodeStore((s) => s.removeEdgeById);

  const inboundEdges = useNodeStore((s) => {
    return s.edges.filter((e) => e.target === data.id);
  }, actualEdgeUpdate);

  const outboundEdges = useNodeStore((s) => {
    return s.edges.filter((e) => e.source === data.id);
  }, actualEdgeUpdate);

  const setSelectedRecipeIndex = useNodeStore((s) => s.setCrafterRecipeIndex);
  const setSelectedRecipe = (recipe: Recipe) => {
    setSelectedRecipeIndex(data.id, recipes.indexOf(recipe));
  };

  const selectedRecipe = useNodeStore((s) => {
    const potential = s.nodes.find(
      (n) => n.id === data.id && n.data.dataType === MCNodeType.crafter
    );
    if (potential?.data.dataType === MCNodeType.crafter) {
      return recipes[potential.data.recipeIndex];
    }
    return recipes[0];
  });

  const isOutputting = useNodeStore((s) => {
    return Boolean(s.edges.find((edge) => edge.source === data.id));
  });

  useEffect(() => {
    const multiples = selectedRecipe.inputs.map((input) => {
      const inboundEdge = inboundEdges.find(
        (e) => e.data?.item.itemId === input.itemId
      );
      if (inboundEdge?.data?.outputRate) {
        return inboundEdge.data?.outputRate / input.amount;
      }
      return 0;
    });

    const outputRate = Math.min(...multiples) * selectedRecipe.outputAmount;
    setResouceOutputRate(data.id, outputRate);
  }, [
    inboundEdges,
    outboundEdges,
    selectedRecipe,
    data.id,
    setResouceOutputRate,
  ]);

  useEffect(() => {
    inboundEdges.forEach((edge) => {
      const input = selectedRecipe.inputs.find(
        (i) => i.itemId === edge.data?.item.itemId
      );
      if (!input) {
        removeEdge(edge.id);
      }
    });
    updateNodeInternals(data.id);
  }, [selectedRecipe, data.id, inboundEdges, removeEdge, updateNodeInternals]);

  return (
    <BaseNode innerClassName="px-0 py-3" data={data}>
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
        <FontAwesomeIcon icon={faArrowRight} />
        <div className="flex items-center gap-3 pl-3">
          <div className="flex flex-col items-center">
            <SpriteDisplay url={data.item.imageUrl} />
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
    <div className="debug my-2 flex items-center gap-3">
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
        <div className="text-center text-xs text-gray-500">{item.title}</div>
      </div>
    </div>
  );
};
