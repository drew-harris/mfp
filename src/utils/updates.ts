// Stores utility functions to reduce the amount of updates
// Returns true if the state does not meaningfully change

import { Edge } from "reactflow";
import { MCEdge } from "../types/MCNodes";

export const edgeArrayUpdate = (
  oldEdges: Edge<MCEdge>[],
  newEdges: Edge<MCEdge>[]
): boolean => {
  const datas = oldEdges.map((e) => e.data);
  const newDatas = newEdges.map((e) => e.data);

  if (datas.length !== newDatas.length) {
    return false;
  }

  for (let i = 0; i < datas.length; i++) {
    if (datas[i]?.item.itemId !== newDatas[i]?.item.itemId) {
      return false;
    }
    if (datas[i]?.outputRate !== newDatas[i]?.outputRate) {
      return false;
    }
  }

  return true;
};

export const singleEdgeUpdate = (
  oldEdge: Edge<MCEdge> | undefined,
  newEdge: Edge<MCEdge> | undefined
) => {
  if (!oldEdge && newEdge) return false;
  if (oldEdge && !newEdge) return false;
  if (!oldEdge && !newEdge) return true;

  if (oldEdge?.data !== newEdge?.data) return false;

  return true;
};
