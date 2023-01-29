import { MCNodeType } from "../types/MCNodes";

export const getNodeName = (type: MCNodeType): string => {
  if (type == MCNodeType.splitter) {
    return "Splitter";
  } else if (type == MCNodeType.order) {
    return "Order";
  } else {
    return "Other";
  }
};
