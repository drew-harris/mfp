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
  dataType: MCNodeType;
}

export interface MCEdge {
  item: MCItem;
  outputRate: number;
}

export type MCNode = MCResourceNode | MCOutputNode;
