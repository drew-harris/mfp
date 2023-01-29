import { Node, XYPosition } from "reactflow";
import {
  DraggableInfo,
  DraggableItemData,
  MCCrafterNode,
  MCInfoNode,
  MCNodeType,
  MCOrderNode,
  MCResourceNode,
} from "../types/MCNodes";
import { DraggableOrderData } from "../types/tasks";
import { getFirstRecipe } from "./recipe";

type PossibleNode =
  | Node<MCOrderNode>
  | Node<MCResourceNode>
  | Node<MCInfoNode>
  | Node<MCCrafterNode>;

/**
  Processes a draggable data and returns a node to add to the graph.
*/
export function processPickerItem(
  item: DraggableOrderData | DraggableItemData | DraggableInfo,
  projection: XYPosition
): PossibleNode | undefined {
  if (item.type == MCNodeType.order) {
    const orderItem = item as DraggableOrderData;
    return {
      id: orderItem.task.id,
      position: {
        x: projection.x,
        y: projection.y,
      },
      data: {
        task: orderItem.task,
        id: orderItem.task.id,
        dataType: MCNodeType.order,
      },
      type: MCNodeType.order,
    } as Node<MCOrderNode>;
  }

  console.log("item: ", item);

  const regularItem = item as DraggableItemData;

  if (regularItem.type === MCNodeType.resource) {
    const node = {
      id: projection.x.toString(),
      position: {
        x: projection.x,
        y: projection.y,
      },
      data: {
        item: {
          itemId: regularItem.item.itemId,
          spriteIndex: regularItem.item.spriteIndex,
          title: regularItem.item.title,
        },
        ratio: [1],
        dataType: regularItem.type,
        id: projection.x.toString(),
      },
      type: regularItem.type,
    };
    return node;
  }

  if (regularItem.type === MCNodeType.crafter) {
    const node: Node<MCCrafterNode> = {
      id: projection.x.toString(),
      position: {
        x: projection.x,
        y: projection.y,
      },
      data: {
        item: {
          itemId: regularItem.item.itemId,
          spriteIndex: regularItem.item.spriteIndex,
          title: regularItem.item.title,
        },
        dataType: regularItem.type,
        id: projection.x.toString(),
      },
      type: regularItem.type,
    };
    return node;
  }

  if (regularItem.type === MCNodeType.info) {
    const node: Node<MCInfoNode> = {
      id: projection.x.toString(),
      position: {
        x: projection.x,
        y: projection.y,
      },
      data: {
        dataType: regularItem.type,
        id: projection.x.toString(),
      },
      type: regularItem.type,
    };
    return node;
  }
}
