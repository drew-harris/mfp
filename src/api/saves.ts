import { Edge, Node } from "reactflow";
import { gql } from "../__generated__";
import { MCEdge, MCNode } from "../types/MCNodes";

export type SaveData = {
  nodes: Node<MCNode>[];
  edges: Edge<MCEdge>[];
};

export const CREATE_NEW_SAVE = gql(`
mutation CreateNewSave($newSave: NewSave!) {
  createNewSave(input: $newSave) {
    id
    name
    updatedAt
    createdAt
  }
}`);

export const CREATE_CUSTOM_NODE = gql(`
mutation CreateCustomNode($newCustomNode: NewCustomNode!) {
  createCustomNode(input: $newCustomNode) {
    id
    name
    updatedAt
    createdAt
    recipeData
  }
}
`);
