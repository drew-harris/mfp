import { Connection, Node } from "reactflow";
import { MCNode, MCNodeType } from "../types/MCNodes";

export function animationDurationFromPerHour(perHour: number): number {
  if (perHour === 0) return 1000000;
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
    source.data.dataType === MCNodeType.info
  ) {
    return false;
  }

  if (target.data.dataType === MCNodeType.info) {
    return true;
  }

  // The source node must have an item
  const sourceItem = source.data.item;
  if (!sourceItem) {
    console.log("Source node has no item");
    return false;
  }

  if (target.data.dataType === MCNodeType.order) {
    const requirements = target.data.task.itemRequirements;

    if (
      requirements &&
      !requirements.some((req) => req.itemId === sourceItem.itemId)
    ) {
      return false;
    }
  }

  // What does this mean
  if (connection.targetHandle) {
    if (sourceItem.itemId.toString() !== connection.targetHandle) {
      return false;
    }
  }

  return true;
}
