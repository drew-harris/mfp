import { Edge, Node } from "reactflow";
import { MCEdge, MCItem, MCNode } from "./MCNodes";

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

export type CustomNodePayload = {
  graphData: {
    nodes: Node<MCNode>;
    edges: Edge<MCEdge>;
  };
  recipeData: {
    recipes: CustomRecipe[];
  };
};
