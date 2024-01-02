import { CustomNode } from "../__generated__/graphql";
import { CustomRecipe, Ratios } from "../utils/builder";
import { DraggableOrderData, Task } from "./tasks";

export enum MCNodeType {
  resource = "resource",
  crafter = "crafter",
  splitter = "splitter",
  order = "order",
  info = "info",
  builder = "builder",
  custom = "custom",
}

export interface MCItem {
  title: string;
  spriteIndex?: number;
  imageUrl: string;
  itemId: string;
}

export interface MCPickerItem extends MCItem {
  dataType: MCNodeType.resource | MCNodeType.crafter;
}

export interface MCResourceNode extends MCBaseNode {
  item: MCItem;
  dataType: MCNodeType.resource;
}

export interface MCSplitterNode extends MCBaseNode {
  item?: MCItem;
  ratios: { [key: string]: number };
  splitString: string;
  dataType: MCNodeType.splitter;
}

export interface MCOrderNode extends MCBaseNode {
  task: Task;
  dataType: MCNodeType.order;
}

export interface MCCrafterNode extends MCBaseNode {
  item: MCItem;
  dataType: MCNodeType.crafter;
  recipeIndex: number;
}

export interface MCInfoNode extends MCBaseNode {
  dataType: MCNodeType.info;
}

export interface MCBuilderNode extends MCBaseNode {
  dataType: MCNodeType.builder;
}

export interface MCCustomNode extends MCBaseNode {
  dataType: MCNodeType.custom;
  recipies: CustomRecipe[];
}

export interface MCEdge {
  builderColor?: string;
  item: MCItem;
  outputRate: number;
}

interface MCBaseNode {
  id: string;
  dataType: MCNodeType;
}

export type MCNode =
  | MCResourceNode
  | MCSplitterNode
  | MCInfoNode
  | MCCrafterNode
  | MCBuilderNode
  | MCCustomNode
  | MCOrderNode;

export interface DraggableItemData {
  type: MCNodeType;
  draggableType: DraggableType.item;
  item: MCPickerItem;
}

export interface DraggableInfo {
  type: MCNodeType.info;
  draggableType: DraggableType.info;
}

export interface DraggableBuilder {
  type: MCNodeType.builder;
  draggableType: DraggableType.builder;
}

export interface DraggableSplitterData {
  type: MCNodeType.splitter;
  draggableType: DraggableType.splitter;
}

export enum DraggableType {
  item = "item",
  order = "order",
  info = "info",
  splitter = "splitter",
  builder = "builder",
}

export type DraggableData =
  | DraggableItemData
  | DraggableOrderData
  | DraggableSplitterData
  | DraggableBuilder
  | DraggableInfo;

export interface Recipe {
  outputItemId: string;
  outputAmount: number;
  inputs: {
    itemId: string;
    amount: number;
  }[];
}
