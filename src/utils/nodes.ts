import { MCNodeType } from "../types/MCNodes";

export const getNodeName = (type: MCNodeType): string => {
  if (type === MCNodeType.splitter) {
    return "Splitter";
  } else if (type === MCNodeType.order) {
    return "Order";
  } else if (type === MCNodeType.resource) {
    return "Resource";
  } else if (type === MCNodeType.crafter) {
    return "Crafter";
  } else if (type === MCNodeType.info) {
    return "Info";
  } else {
    return "Unknown";
  }
};
