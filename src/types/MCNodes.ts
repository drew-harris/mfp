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
}

export interface MCResourceItem extends MCItemBase {
  itemId: number;
  dataType: MCNodeType.resource;
}

export interface MCOutputItem extends MCItemBase {
  itemId: number;
  dataType: MCNodeType.output;
}

export type MCNode = MCResourceNode;

export type MCItem = MCResourceItem | MCOutputItem;

export interface MCResourceNode extends MCResourceItem {
  outputRate: number;
  id: string;
}
