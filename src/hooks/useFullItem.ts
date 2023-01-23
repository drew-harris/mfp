import { useState } from "react";
import { allItems } from "../hardcoded/resourceItems";
import { MCItem } from "../types/MCNodes";

export const useFullItem = (itemId: number) => {
  const [item] = useState(itemFromId(itemId));
  return item;
};

function itemFromId(id: number | undefined): MCItem {
  return allItems.find((item) => item.itemId == id) || allItems[0];
}
