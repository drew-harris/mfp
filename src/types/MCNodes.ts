export const enum MCNodeType {
  resource = "resource",
  craftable = "craftable",
  output = "custom-output",
  custom = "custom",
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
  outputRate: number;
  dataType: MCNodeType;
  id: string;
}

export interface MCOutputNode {
  item: MCItem;
  outputRate: number;
  dataType: MCNodeType;
  id: string;
}

export interface MCEdge {
  item: MCItem;
}

export type MCNode = MCResourceNode | MCOutputNode;
