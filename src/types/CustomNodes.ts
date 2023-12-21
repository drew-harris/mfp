import { Edge } from "reactflow";
import { MCEdge, MCItem } from "./MCNodes";

export type EdgeWithCoeff = Edge<MCEdge> & {
  coeff: number;
};

export type Ratios = {
  num: number;
  itemId: string;
}[];

export type CustomRecipe = {
  item: MCItem;
  inputs: Ratios;
};

