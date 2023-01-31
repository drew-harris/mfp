import { MCItem, MCNodeType, MCPickerItem } from "../types/MCNodes";
import { allRecipes } from "./recipes";

const blockNames = [
  "Stone", // 0
  "Grass", // 1
  "Dirt", // 2
  "Cobblestone", // 3
  "Oak Planks", // 4
  "Dark Planks", // 5
  "Birch Planks", // 6
  "Jungle Planks", // 7
  "Oak Sapling", // 8
  "Dark Sapling", // 9
  "Birch Sapling", // 10
  "Jungle Sapling", // 11
  "Bedrock", // 12
  "Water", // 13
  "?", // 14
  "Lava", // 15
  "Lava", // 16
  "Sand", // 17
  "Gravel", // 18
  "Gold Ore", // 19
  "Iron Ore", // 20
  "Coal Ore", // 21
  "Oak Logs", // 22
  "Dark Logs", // 23
  "Birch Logs", // 24
  "Jungle Logs", // 25
  "Oak Leaves", // 26
  "Weird Leaves", // 27
  "Winter Leaves", // 28
  "Jungle Leaves", // 29
  "Sponge", // 30
  "Glass", // 31
  "Lapis Ore", // 32
  "Lapis Lazuli", // 33
  "Dispenser", // 34
  "Sand Stone", // 35
  "Decorative Sand Stone", // 36
  "Smooth Sand Stone", // 37
  "Jukebox", // 38
  "Bed", // 39
  "Powered Rails", // 40
  "Detector Rail", // 41
  "Sticky Piston", // 42
];

export const resourceItems: MCPickerItem[] = blockNames.map((name, index) => {
  return {
    dataType: MCNodeType.resource,
    itemId: index,
    spriteIndex: index,
    title: name,
  };
});

export const crafterItems: MCPickerItem[] = blockNames
  .map((name, index) => {
    return {
      dataType: MCNodeType.crafter,
      itemId: index,
      spriteIndex: index,
      title: name,
    };
  })
  .filter((item) => {
    console.log(item);
    return allRecipes.findIndex((r) => r.outputItemId == item.itemId) >= 0;
  }) as MCPickerItem[];

export const allItems: MCItem[] = blockNames.map((name, index) => {
  return {
    itemId: index,
    spriteIndex: index,
    title: name,
  } as MCItem;
});
