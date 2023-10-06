import { Edge, Node } from "reactflow";
import { MCEdge, MCNode, MCNodeType } from "../types/MCNodes";

//
const getRandomId = (): number => {
  return Math.random();
};

// Strip the order nodes and rotate the ids
export function reformatSave(
  nodes: Node<MCNode>[],
  edges: Edge<MCEdge>[]
): {
  nodes: Node<MCNode>[];
  edges: Edge<MCEdge>[];
} {
  // Remove all order nodes
  nodes = nodes.filter((node) => node.data.dataType !== MCNodeType.order);
  // Remove all edges connected to an order
  edges = edges.filter((edge) => {
    const target = edge.targetNode as Node<MCNode>;
    const source = edge.sourceNode as Node<MCNode>;
    if (target.data.dataType === MCNodeType.order) {
      return false;
    } else if (source.data.dataType === MCNodeType.order) {
      return false;
    }
    return true;
  });

  for (let i = 0; i < nodes.length; i++) {
    const previousId = nodes[i].id;
    nodes[i] = {
      ...nodes[i],
      id: getRandomId().toString(),
    };
    // Update all connecting edges
    edges = edges.map((edge) => {
      if (edge.source === previousId) {
        return {
          ...edge,
          source: nodes[i].id,
        };
      } else if (edge.target === previousId) {
        return {
          ...edge,
          target: nodes[i].id,
        };
      }
      return edge;
    });
  }

  // Replace the
  return { nodes, edges };
}
