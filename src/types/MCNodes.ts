import { DraggableOrderData, Task } from "./tasks";

export enum MCNodeType {
  resource = "resource",
  crafter = "crafter",
  splitter = "splitter",
  order = "order",
  info = "info",
}

export interface MCItem {
  title: string;
  spriteIndex: number;
  itemId: number;
}

export interface MCPickerItem extends MCItem {
  dataType: MCNodeType.resource | MCNodeType.splitter | MCNodeType.crafter;
}

export interface MCResourceNode extends MCBaseNode {
  item: MCItem;
  dataType: MCNodeType.resource;
}

export interface MCSplitterNode extends MCBaseNode {
  item?: MCItem;
  ratio: number[];
  dataType: MCNodeType.splitter;
}

export interface MCOrderNode extends MCBaseNode {
  task: Task;
  dataType: MCNodeType.order;
}

export interface MCCrafterNode extends MCBaseNode {
  item: MCItem;
  dataType: MCNodeType.crafter;
}

export interface MCInfoNode extends MCBaseNode {
  dataType: MCNodeType.info;
}

export interface MCEdge {
  item: MCItem;
  outputRate: number;
}

interface MCBaseNode {
  id: string;
  dataType: MCNodeType;
}

export type MCNode =
  | MCResourceNode
  | MCSplitterNode
  | MCInfoNode
  | MCCrafterNode
  | MCOrderNode;

export interface DraggableItemData {
  type: MCNodeType;
  item: MCItem;
}

export interface DraggableInfo {
  type: MCNodeType.info;
}

export type DraggableData =
  | DraggableItemData
  | DraggableOrderData
  | DraggableInfo;

export interface Recipe {
  outputItemId: number;
  outputAmount: number;
  inputs: {
    itemId: number;
    amount: number;
  }[];
}
