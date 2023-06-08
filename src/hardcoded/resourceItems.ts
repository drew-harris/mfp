import { MCItem, MCNodeType, MCPickerItem } from "../types/MCNodes";
import { allRecipes } from "./recipes";

import items from "./items.json";

export const resourceItems: MCPickerItem[] = items
  .map((item) => {
    return {
      dataType: MCNodeType.resource,
      itemId: item.itemId,
      imageUrl: item.imageUrl,
      title: item.title,
    };
  })
  .filter((item): boolean => {
    if (item.title.includes("Wood")) {
      return true;
    }
    if (item.title.includes("Ingot")) {
      return true;
    }
    return !allRecipes.some((r) => r.outputItemId === item.itemId);
  }) as MCPickerItem[];

export const crafterItems: MCPickerItem[] = items
  .map((item) => {
    return {
      dataType: MCNodeType.crafter,
      itemId: item.itemId,
      imageUrl: item.imageUrl,

      title: item.title,
    };
  })
  .filter((item) => {
    return allRecipes.findIndex((r) => r.outputItemId === item.itemId) >= 0;
  }) as MCPickerItem[];

export const allItems: MCItem[] = items.map((item) => {
  return {
    itemId: item.itemId,
    imageUrl: item.imageUrl,
    title: item.title,
  } as MCItem;
});
