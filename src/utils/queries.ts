// Set of queries to run on the nodes and edges

import { Edge } from "reactflow";
import { allRecipes } from "../hardcoded/recipes";
import { EfficiencyInfo, NodesAndEdges } from "../hooks/useTaskComplete";
import { MCEdge, MCItem, MCNodeType } from "../types/MCNodes";

type NE = NodesAndEdges;

export function getEdgesIntoNode(ne: NE, nodeId: string): Edge<MCEdge>[] {
  const edges = ne.edges.filter((e) => e.target == nodeId);
  return edges;
}

export function getEdgesIntoOrderNode(ne: NE): Edge<MCEdge>[] {
  const possibleOrderNode = ne.nodes.find(
    (n) => n.data.dataType == MCNodeType.order
  );

  console.log("Possible order node: ", possibleOrderNode);
  return possibleOrderNode ? getEdgesIntoNode(ne, possibleOrderNode.id) : [];
}

export function getRequiredItemSet(item: MCItem): MCItem[][] {
  // Recursively get all the required items to make it
  const recipes = allRecipes.find((r) => r.outputItemId == item.itemId);

  return [];
}

export function getCrafterEfficiencies(ne: NE): EfficiencyInfo[] {
  const crafterNodes = ne.nodes.filter(
    (n) => n.data.dataType === MCNodeType.crafter
  );
  return [];
}

export function getOrderEfficiency(ne: NE): EfficiencyInfo | null {
  const orderNode = ne.nodes.find((n) => n.data.dataType == MCNodeType.order);
  if (!orderNode) return null;

  return null;
}
