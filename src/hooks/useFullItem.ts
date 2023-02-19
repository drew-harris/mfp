import { useState } from "react";
import { allItems } from "../hardcoded/resourceItems";
import { MCItem } from "../types/MCNodes";

export const useFullItem = (itemId: string) => {
  const [item] = useState(itemFromId(itemId));
  return item;
};

export function itemFromId(id: string | undefined): MCItem {
  return allItems.find((item) => item.itemId == id) || allItems[0];
}
