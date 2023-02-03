import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";
import { Edge, Handle, Position } from "reactflow";
import { allRecipes } from "../../hardcoded/recipes";
import { useNodeStore } from "../../stores/nodes";
import { MCCrafterNode, MCEdge } from "../../types/MCNodes";
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

  const setResouceOutputRate = useNodeStore((s) => s.setResourceOutputRate);
  const removeEdge = useNodeStore((s) => s.removeEdgeById);

  const inboundEdges = useNodeStore((s) => {
    return s.edges.filter((e) => e.target === data.id);
  }, actualEdgeUpdate);

  const outboundEdges = useNodeStore((s) => {
    return s.edges.filter((e) => e.source === data.id);
  }, actualEdgeUpdate);

  const [selectedRecipe, setSelectedRecipe] = useState(recipes[0]);

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
  }, [inboundEdges, outboundEdges, selectedRecipe]);

  useEffect(() => {
    inboundEdges.forEach((edge) => {
      const input = selectedRecipe.inputs.find(
        (i) => i.itemId === edge.data?.item.itemId
      );
      if (!input) {
        removeEdge(edge.id);
      }
    });
  }, [selectedRecipe]);

  return (
    <BaseNode innerClassName="px-0 py-3" data={data}>
      <RecipeSelector
        recipes={recipes}
        selectedRecipe={selectedRecipe}
        setSelectedRecipe={setSelectedRecipe}
      />
      <div className="flex gap-3 items-center">
        <div>
          {selectedRecipe.inputs.map((input) => (
            <CrafterInput input={input} key={input.itemId} />
          ))}
        </div>
        <FontAwesomeIcon icon={faArrowRight} />
        <div className="flex gap-3 items-center pl-3">
          <div>
            <SpriteDisplay spriteIndex={data.item.spriteIndex} />
          </div>
          <Handle
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
    itemId: number;
    amount: number;
  };
}) => {
  return (
    <div className="flex gap-3 items-center my-2">
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
      <SpriteDisplay spriteIndex={input.itemId} />x {input.amount}
    </div>
  );
};
