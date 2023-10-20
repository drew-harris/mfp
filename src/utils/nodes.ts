import { MCNodeType } from "../types/MCNodes";

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
