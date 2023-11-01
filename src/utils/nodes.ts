import { Edge, Node } from "reactflow";
import { MCEdge, MCNode, MCNodeType } from "../types/MCNodes";
import { useNodeStore } from "../stores/nodes";

export const getNodeName = (type: MCNodeType): string => {
  switch (type) {
    case MCNodeType.splitter: {
      return "Splitter";
    }
    case MCNodeType.order: {
      return "Order";
    }
    case MCNodeType.resource: {
      return "Resource";
    }
    case MCNodeType.crafter: {
      return "Crafter";
    }
    case MCNodeType.info: {
      return "Info";
    }
    case MCNodeType.builder: {
      return "Builder";
    }
    default: {
      return "Unknown";
    }
  }
};

export const getNodeById = (id: string) => {
  const { nodes } = useNodeStore.getState();

  return nodes.find((n) => n.id === id);
};
