export const enum MCNodeType {
  resource = "resource",
  craftable = "craftable",
  output = "output",
  custom = "custom",
}

export interface MCItemBase {
  title: string;
  imageUrl: string | null;
  dataType: MCNodeType;
  itemId: number;
}

export interface MCResourceItem extends MCItemBase {
  dataType: MCNodeType.resource;
}

export interface MCOutputItem extends MCItemBase {
  dataType: MCNodeType.output;
}

export type MCNode = MCResourceNode | MCOutputNode;

export type MCItem = MCResourceItem | MCOutputItem;

export interface MCResourceNode extends MCResourceItem {
  outputRate: number;
}

export interface MCOutputNode extends MCOutputItem {
  outputRate: number;
}
