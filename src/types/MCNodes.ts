import { DraggableOrderData, Task } from "./tasks";

export enum MCNodeType {
  resource = "resource",
  crafter = "crafter",
  output = "custom-output",
  splitter = "splitter",
  order = "order",
}

export interface MCItem {
  title: string;
  spriteIndex: number;
  itemId: number;
}

export interface MCPickerItem extends MCItem {
  dataType:
    | MCNodeType.output
    | MCNodeType.resource
    | MCNodeType.splitter
    | MCNodeType.crafter;
}

export interface MCResourceNode extends MCBaseNode {
  item: MCItem;
  dataType: MCNodeType.resource;
}

export interface MCOutputNode extends MCBaseNode {
  item: MCItem;
  dataType: MCNodeType.output;
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
  recipe: Recipe;
  dataType: MCNodeType.crafter;
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
  | MCOutputNode
  | MCResourceNode
  | MCSplitterNode
  | MCCrafterNode
  | MCOrderNode;

export interface DraggableItemData {
  type: MCNodeType;
  item: MCItem;
}

export type DraggableData = DraggableItemData | DraggableOrderData;

export interface Recipe {
  outputAmount: number;
  inputs: {
    itemId: number;
    amount: number;
  }[];
}
