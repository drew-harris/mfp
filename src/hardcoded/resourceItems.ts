import { MCNodeType, MCOutputItem, MCResourceItem } from "../types/MCNodes";

const blockNames = [
  "Stone",
  "Grass",
  "Dirt",
  "Cobblestone",
  "Oak Planks",
  "Dark Planks",
  "Birch Planks",
  "Jungle Planks",
  "Oak Sapling",
  "Dark Sapling",
  "Birch Sapling",
  "Jungle Sapling",
  "Bedrock",
  "Water",
  "?",
  "Lava",
  "Lava",
  "Sand",
  "Gravel",
  "Gold Ore",
  "Iron Ore",
  "Coal Ore",
  "Oak Logs",
  "Dark Logs",
  "Birch Logs",
];

export const resourceItems: MCResourceItem[] = blockNames.map((name, index) => {
  return {
    dataType: MCNodeType.resource,
    itemId: index,
    spriteIndex: index,
    title: name,
  };
});

export const outputItems: MCOutputItem[] = blockNames.map((name, index) => {
  return {
    dataType: MCNodeType.output,
    itemId: index,
    spriteIndex: index,
    title: name,
  };
});
