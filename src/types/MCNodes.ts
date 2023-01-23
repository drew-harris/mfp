export const enum MCNodeType {
  resource = "resource",
  craftable = "craftable",
  output = "custom-output",
  custom = "custom",
  splitter = "splitter",
}

export interface MCItem {
  title: string;
  spriteIndex: number;
  itemId: number;
}

export interface MCPickerItem extends MCItem {
  dataType: MCNodeType;
}

export interface MCResourceNode {
  item: MCItem;
  dataType: MCNodeType;
  id: string;
}

export interface MCOutputNode {
  item: MCItem;
  dataType: MCNodeType;
  id: string;
}

export interface MCSplitterNode {
  id: string;
  dataType: MCNodeType.splitter;
  item?: MCItem;
  ratio: number[];
}

export interface MCEdge {
  item: MCItem;
  outputRate: number;
}

export type MCNode = MCOutputNode | MCResourceNode | MCSplitterNode;

export interface DraggableData {
  type: MCNodeType;
  item?: MCItem | undefined;
}
