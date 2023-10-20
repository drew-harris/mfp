import { Node, XYPosition } from "reactflow";
import {
  DraggableBuilder,
  DraggableInfo,
  DraggableItemData,
  DraggableSplitterData,
  MCBuilderNode,
  MCCrafterNode,
  MCInfoNode,
  MCNodeType,
  MCOrderNode,
  MCResourceNode,
  MCSplitterNode,
} from "../types/MCNodes";
import { DraggableOrderData } from "../types/tasks";

type PossibleNode =
  | Node<MCOrderNode>
  | Node<MCResourceNode>
  | Node<MCInfoNode>
  | Node<MCBuilderNode>
  | Node<MCSplitterNode>
  | Node<MCCrafterNode>;

/**
  Processes a draggable data and returns a node to add to the graph.
*/
export function processPickerItem(
  item:
    | DraggableOrderData
    | DraggableBuilder
    | DraggableItemData
    | DraggableInfo
    | DraggableSplitterData,
  projection: XYPosition
): PossibleNode {
  if (item.type === MCNodeType.order) {
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

  if (item.type === MCNodeType.info) {
    const node: Node<MCInfoNode> = {
      id: projection.x.toString(),
      position: {
        x: projection.x,
        y: projection.y,
      },
      data: {
        dataType: MCNodeType.info,
        id: projection.x.toString(),
      },
      type: MCNodeType.info,
    };
    return node;
  }

  if (item.type === MCNodeType.builder) {
    const node: Node<MCBuilderNode> = {
      id: projection.x.toString(),
      position: {
        x: projection.x,
        y: projection.y,
      },
      data: {
        dataType: MCNodeType.builder,
        id: projection.x.toString(),
      },
      type: MCNodeType.builder,
    };
    return node;
  }

  if (item.type === MCNodeType.splitter) {
    const node: Node<MCSplitterNode> = {
      id: projection.x.toString(),
      position: {
        x: projection.x,
        y: projection.y,
      },
      data: {
        dataType: MCNodeType.splitter,
        splitString: "",
        ratios: [],
        id: projection.x.toString(),
      },
      type: MCNodeType.splitter,
    };
    return node;
  }

  const regularItem = item as DraggableItemData;

  navigator.clipboard
    .writeText(regularItem.item.itemId)
    .catch(() => console.log("oh no"));

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
          imageUrl: regularItem.item.imageUrl,
          title: regularItem.item.title,
        },
        ratio: [1],
        dataType: regularItem.type,
        id: projection.x.toString(),
      },
      type: regularItem.type,
    } as Node<MCResourceNode>;
    return node;
  } else {
    // Crafter
    const node: Node<MCCrafterNode> = {
      id: projection.x.toString(),
      position: {
        x: projection.x,
        y: projection.y,
      },
      data: {
        item: {
          itemId: regularItem.item.itemId,
          imageUrl: regularItem.item.imageUrl,
          title: regularItem.item.title,
        },
        recipeIndex: 0,
        dataType: regularItem.type,
        id: projection.x.toString(),
      },
      type: regularItem.type,
    } as Node<MCCrafterNode>;
    return node;
  }
}
