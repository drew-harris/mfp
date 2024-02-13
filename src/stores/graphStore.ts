import create from "zustand";
import { MCItem, MCNodeType } from "../types/MCNodes";
import { applyNodeChanges } from "reactflow";

export type GraphState = {
  items: item[];

}

interface item {
  name: string,
  isHidden: boolean,
  nodeType: MCNodeType,
}
export const useGraphStore = create<GraphState>((set, get) => ({
  items: [],

  setItems: (itemArr: item[]) => {
    set({
      items: itemArr,
    })
  },

  hideItem: (itemsToHide: MCItem[]) => {
    items = itemsToHide.forEach()
  },
}))

