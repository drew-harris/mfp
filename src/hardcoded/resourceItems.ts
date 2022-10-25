import { MCNodeType, MCResourceItem } from "../types/MCNodes";

export const resourceItems: MCResourceItem[] = [
  {
    dataType: MCNodeType.resource,
    imageUrl: "/grass.png",
    itemId: 1,
    title: "Grass",
  },
  {
    dataType: MCNodeType.resource,
    imageUrl: "/grass.png",
    itemId: 2,
    title: "Dirt",
  },
  {
    dataType: MCNodeType.resource,
    imageUrl: null,
    itemId: 3,
    title: "Redstone",
  },
];
