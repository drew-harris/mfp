import { DraggableOrderData, Task } from "./tasks";

export const enum MCNodeType {
  resource = "resource",
  craftable = "craftable",
  output = "custom-output",
  custom = "custom",
  splitter = "splitter",
  order = "order",
}

export interface MCItem {
  title: string;
  spriteIndex: number;
  itemId: number;
}

export interface MCPickerItem extends MCItem {
  dataType: MCNodeType.output | MCNodeType.resource | MCNodeType.splitter;
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
  | MCOrderNode;

export interface DraggableItemData {
  type: MCNodeType;
  item?: MCItem | undefined;
}

export type DraggableData = DraggableItemData | DraggableOrderData;
