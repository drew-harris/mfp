import { gql } from "../__generated__";
import { LogType } from "../__generated__/graphql";
import { User } from "../components/contexts/UserContext";
import { client } from "./client";
import { Connection, Edge, Node } from "reactflow";
import { MCEdge, MCNode, MCNodeType } from "../types/MCNodes";
import { allRecipes } from "../hardcoded/recipes";
import { idToItem } from "../utils/idToItem"
import { getNodeById } from "../utils/nodes";

export const SUBMIT_LOG = gql(`
mutation SubmitLog($input: LogInput!) {
  log(input: $input) {
    id
  }
}`);
export const sendLog = (
  type: LogType,
  attributes?: Record<string, string | number>,
  message?: string,
) => {
  const userBlob = window.localStorage.getItem("userblob");
  if (!userBlob) return;
  const user = JSON.parse(userBlob) as User;

  if (attributes) {
    console.log("LOGGING with id:", user.id, "and log type:", type, "with attributes:", attributes);
  } else {
    console.log("LOGGING with id:", user.id, "and log type:", type);
  }

  client.mutate({
    mutation: SUBMIT_LOG,
    variables: {
      input: {
        type: type,
        playerName: user.id,
        attributes: attributes,
        message: message,
      },
    },
  });
};

export function logNode(logType: LogType, node: Node<MCNode>): void {
  const attributes: Record<string, string | number> = getNodeAttributes(node)
  sendLog(logType, attributes);
}

function getNodeAttributes(node: Node<MCNode>): Record<string, string | number> {
  let attributes;
  const type = node.data.dataType
  switch(type) {
    case MCNodeType.crafter: {
      const recipe = allRecipes
        .filter((r) => r.outputItemId === node.data.item.itemId)
        .at(node.data.recipeIndex || 0);
      const inputs = recipe.inputs.map(obj => `${idToItem(obj.itemId)}: ${obj.amount}`).join(', ');
      attributes = {
        type: type,
        inputs: inputs,
        output: node.data.item?.title
      }
      break;
    }
    case MCNodeType.order: {
      const inputs = node.data.task.itemRequirements.map(obj => `${idToItem(obj.itemId)}: ${obj.rate}`).join(', ');
      attributes = {
        type: MCNodeType.crafter,
        inputs: inputs,
      }
      break;
    }
    case MCNodeType.custom: {
      const inputs = node.data.recipes.map((r) => r.inputs.map(obj => `${idToItem(obj.itemId)}: ${obj.num}`).join(', ')).join(', ')
      const outputs = node.data.recipes.map((r) => r.item.title).join(', ')
      attributes = {
        type: type,
        name: node.data.name,
        inputs: inputs,
        output: outputs,
      }
      break;
    }
    case MCNodeType.resource: {
      attributes = {
        type: type,
        block: node.data.item?.title
      }
      break;
    }
    default: {
      attributes = {
        type: type,
      }
    }
  }

  return attributes
}

export function logEdge(logType: LogType, edge: Edge<MCEdge>): void {
  // if (!edge || !edge.sourceNode || !edge.targetNode) {
  //   console.log("ERROR: Edge or edge's nodes are undefined!")
  //   console.log(edge)
  //   return;
  // }
  const sourceNode = getNodeById(edge.source)
  const targetNode = getNodeById(edge.target)
  const sourceAttributes = getNodeAttributes(sourceNode);
  const targetAttributes = getNodeAttributes(targetNode);
  const attributes: Record<string, string | number> = {
    edgeItem: edge.data.item.title,
    outputRate: edge.data.outputRate
  };

  if (!sourceAttributes || !targetAttributes) return;

  for (const attr in sourceAttributes) {
    const newKey = "source" + attr.charAt(0).toUpperCase() + attr.slice(1);
    attributes[newKey] = sourceAttributes[attr];
  }

  for (const attr in targetAttributes) {
    const newKey = "target" + attr.charAt(0).toUpperCase() + attr.slice(1);
    attributes[newKey] = targetAttributes[attr];
  }

  sendLog(logType, attributes);
}

export function logConnection(logType: LogType, edge: Connection): void {
  // if (!edge || !edge.sourceNode || !edge.targetNode) {
  //   console.log("ERROR: Edge or edge's nodes are undefined!")
  //   console.log(edge)
  //   return;
  // }
  const sourceNode = getNodeById(edge.source)
  const targetNode = getNodeById(edge.target)
  const sourceAttributes = getNodeAttributes(sourceNode);
  const targetAttributes = getNodeAttributes(targetNode);
  const attributes: Record<string, string | number> = {
    edgeItem: sourceNode.data.item.title
  };

  if (!sourceAttributes || !targetAttributes) return;

  for (const attr in sourceAttributes) {
    const newKey = "source" + attr.charAt(0).toUpperCase() + attr.slice(1);
    attributes[newKey] = sourceAttributes[attr];
  }

  for (const attr in targetAttributes) {
    const newKey = "target" + attr.charAt(0).toUpperCase() + attr.slice(1);
    attributes[newKey] = targetAttributes[attr];
  }

  sendLog(logType, attributes);
}
