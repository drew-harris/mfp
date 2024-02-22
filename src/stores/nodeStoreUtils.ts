import { Connection, Node } from "reactflow";
import { MCNode, MCNodeType } from "../types/MCNodes";

export function animationDurationFromPerHour(perHour: number): number {
  if (perHour === 0) return 1_000_000;
  if (perHour > 100) return 4;
  return (100 - perHour) * 4;
}

export function checkIfNodesConnect(
  source: Node<MCNode>,
  target: Node<MCNode>,
  connection: Connection
): boolean {
  console.log("Checking if nodes connect", source, target, connection);
  // Source should always have an item to pass
  if (
    source.data.dataType === MCNodeType.order ||
    source.data.dataType === MCNodeType.builder
  ) {
    console.log("Node connection invalid. Rejecting connection.");
    return false;
  }

  if (target.data.dataType === MCNodeType.builder) {
    console.log("Node connection valid. Connection should be accepted.");
    return true;
  }

  // Custom node to others
  if (source.data.dataType === MCNodeType.custom) {
    if (target.data.dataType === MCNodeType.crafter) {
      console.log("Node connection valid. Connection should be accepted.");
      return true;
    } else {
      console.log("Node connection invalid. Rejecting connection.");
      return false;
    }
  }

  // The source node must have an item
  const sourceItem = source.data.item;
  if (!sourceItem) {
    console.log("Source node has no item");
    console.log("Node connection invalid. Rejecting connection.");
    return false;
  }

  if (target.data.dataType === MCNodeType.order) {
    const requirements = target.data.task.itemRequirements;

    if (
      requirements &&
      !requirements.some((request) => request.itemId === sourceItem.itemId)
    ) {
      console.log("Node connection invalid. Rejecting connection.");
      return false;
    }
  }

  // What does this mean
  if (
    connection.targetHandle &&
    sourceItem.itemId.toString() !== connection.targetHandle
  ) {
    console.log("Node connection invalid. Rejecting connection.");
    return false;
  }

  console.log("Node connection valid. Connection should be accepted.");
  return true;
}
