import { Edge, Node } from "reactflow";
import {
  MCBuilderNode,
  MCEdge,
  MCItem,
  MCNode,
  MCNodeType,
} from "../types/MCNodes";
import { RFState, useNodeStore } from "../stores/nodes";
import { allRecipes } from "../hardcoded/recipes";

const getSourceNodeOfEdge = (edge: Edge<MCEdge>, state: RFState) => {
  return state.nodes.find((n) => n.id === edge.source);
};

type EdgeWithCoeff = Edge<MCEdge> & {
  coeff: number;
};

export type Ratios = {
  num: number;
  itemId: string;
}[];

export type CustomRecipe = {
  item: MCItem;
  inputs: Ratios;
};

export type FindCoefficientsSuccess = {
  status: "success";
  recipes: CustomRecipe[];
  graph: {
    nodes: Node<MCNode>[];
    edges: Edge<MCEdge>[];
  };
};

export type FindCoefficientsResult =
  | {
      status: "success";
      recipes: CustomRecipe[];
      graph: {
        nodes: Node<MCNode>[];
        edges: Edge<MCEdge>[];
      };
    }
  | {
      status: "invalid";
      message: string;
    };

export function findCoefficients(
  builderNode: Node<MCBuilderNode>
): FindCoefficientsResult {
  const totalNodes: Node<MCNode>[] = [builderNode];
  const totalEdges = [];

  if (!builderNode?.id) {
    return {
      status: "invalid",
      message: "No builder node provided",
    };
  }

  const state = useNodeStore.getState();
  const incomingEdges = state.edges.filter((e) => e.target === builderNode.id);
  const queryEdges: EdgeWithCoeff[] = incomingEdges.map((e) => ({
    ...e,
    coeff: 1,
  }));
  const results: CustomRecipe[] = [];

  while (queryEdges.length > 0) {
    const initialQueryEdge = queryEdges.pop();
    const roundQueryEdges = [initialQueryEdge];
    const roundEdges = [];
    while (roundQueryEdges.length > 0) {
      const toQuery = roundQueryEdges.pop();
      totalEdges.push(toQuery);
      const sourceNode = getSourceNodeOfEdge(toQuery, state);
      totalNodes.push(sourceNode);
      switch (sourceNode.data.dataType) {
        case MCNodeType.resource: {
          roundEdges.push(toQuery);
          break;
        }
        case MCNodeType.crafter: {
          const recipeIdx = sourceNode.data.recipeIndex;
          const recipeItem = sourceNode.data.item;
          const recipe = allRecipes
            .filter((r) => r.outputItemId === recipeItem.itemId)
            .at(recipeIdx || 0);

          const incomingEdges = state.edges.filter(
            (e) => e.target === sourceNode.id
          );

          if (incomingEdges.length !== recipe.inputs.length) {
            return {
              status: "invalid",
              message: "Recipe inputs don't match incoming edges",
            };
          }

          for (const edge of incomingEdges) {
            const recipeinput = recipe.inputs.find(
              (i) => i.itemId === edge.data.item.itemId
            );
            roundQueryEdges.push({
              ...edge,
              coeff: (toQuery.coeff / recipe.outputAmount) * recipeinput.amount,
            });
          }

          break;
        }
        default: {
          return {
            status: "invalid",
            message: "You used an unsupported node type",
          };
        }
      }
    }

    // Add round edges to result
    results.push({
      item: initialQueryEdge.data.item,
      inputs: roundEdges.map((e) => {
        return {
          num: e.coeff,
          itemId: e.data.item.itemId,
        };
      }),
    });
  }

  return {
    recipes: results,
    status: "success",
    graph: {
      nodes: totalNodes,
      edges: totalEdges,
    },
  };
}
