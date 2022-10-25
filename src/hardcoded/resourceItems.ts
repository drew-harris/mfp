import { MCNodeType, MCOutputItem, MCResourceItem } from "../types/MCNodes";

export const resourceItems: MCResourceItem[] = [
  {
    dataType: MCNodeType.resource,
    spriteIndex: 1,
    itemId: 1,
    title: "Grass",
  },
  {
    dataType: MCNodeType.resource,
    spriteIndex: 2,
    itemId: 2,
    title: "Dirt",
  },
  {
    dataType: MCNodeType.resource,
    spriteIndex: 16,
    itemId: 3,
    title: "Lava",
  },
];

export const outputItems: MCOutputItem[] = [
  {
    dataType: MCNodeType.output,
    spriteIndex: 1,
    itemId: 1,
    title: "Grass",
  },
];
