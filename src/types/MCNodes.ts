export const enum MCNodeType {
  resource = "Resource",
  craftable = "Craftable",
  output = "Output",
  custom = "Custom",
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

export interface MCNode {
  inputs: MCNode[];
}

export type MCItem = MCResourceItem | MCOutputItem;

export interface MCResource extends MCResourceItem, MCNode {
  outputRate: number;
}
