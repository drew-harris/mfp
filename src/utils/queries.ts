// Set of queries to run on the nodes and edges

import { Edge, Node } from "reactflow";
import {
  DebugMessage,
  EfficiencyInfo,
} from "../components/contexts/TaskCompleteProvider";
import { allRecipes } from "../hardcoded/recipes";
import { MCCrafterNode, MCEdge, MCNodeType } from "../types/MCNodes";
import { NodesAndEdges } from "./comparison";

type NE = NodesAndEdges;

export function getEdgesIntoNode(ne: NE, nodeId: string): Edge<MCEdge>[] {
  const edges = ne.edges.filter((e) => e.target === nodeId);
  return edges;
}

export function getEdgesIntoOrderNode(ne: NE): Edge<MCEdge>[] {
  const possibleOrderNode = ne.nodes.find(
    (n) => n.data.dataType === MCNodeType.order
  );

  console.log("Possible order node: ", possibleOrderNode);
  return possibleOrderNode ? getEdgesIntoNode(ne, possibleOrderNode.id) : [];
}

export function getOrderEfficiency(ne: NE): EfficiencyInfo | null {
  const orderNode = ne.nodes.find((n) => n.data.dataType === MCNodeType.order);
  if (!orderNode) return null;

  return null;
}

export function getCrafterDebugMessages(ne: NE): DebugMessage[] {
  const crafterNodes = ne.nodes.filter(
    (n) => n.data.dataType === MCNodeType.crafter
  ) as Node<MCCrafterNode>[];
  const messages: DebugMessage[] = [];

  for (const crafter of crafterNodes) {
    const currentRecipe = allRecipes
      .filter((r) => r.outputItemId === crafter.data.item.itemId)
      .at(crafter.data.recipeIndex);

    const edges = getEdgesIntoNode(ne, crafter.id);
    if (edges.length !== currentRecipe?.inputs.length) {
      messages.push({
        message:
          "Crafter is missing inputs for " +
          crafter.data.item.title.toLowerCase(),
      });
    }
  }

  return messages;
}
