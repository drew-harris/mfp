import { gql } from "../__generated__";

export const GET_CUSTOM_NODES = gql(`
query GetCustomNodes($playerId:String){
  customNodes(playerId:$playerId) {
    id
    name
    recipeData
  }
}`);

export const GET_CUSTOM_NODE = gql(`
query GetCustomNode($nodeId:ID!){
  customNode(id:$nodeId) {
    id
    name
    recipeData
    graphData
  }
}
`);
