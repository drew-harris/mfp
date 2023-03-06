import { RFState } from "../stores/nodes";

export type NodesAndEdges = Pick<RFState, "nodes" | "edges">;

export const strictCompare = (
  newState: NodesAndEdges,
  old: NodesAndEdges
): boolean => {
  // NOTE: May need to add more checks here
  if (newState.nodes.length !== old.nodes.length) return false;
  if (newState.edges.length !== old.edges.length) return false;

  for (let i = 0; i < newState.nodes.length; i++) {
    if (newState.nodes[i].id !== old.nodes[i].id) return false;
    if (newState.nodes[i].type !== old.nodes[i].type) return false;
    if (
      JSON.stringify(newState.nodes[i].data) !==
      JSON.stringify(old.nodes[i].data)
    ) {
      return false;
    }
  }

  for (let i = 0; i < newState.edges.length; i++) {
    if (newState.edges[i].id !== old.edges[i].id) return false;
    if (newState.edges[i].source !== old.edges[i].source) return false;
    if (newState.edges[i].target !== old.edges[i].target) return false;
    if (newState.edges[i].type !== old.edges[i].type) return false;
    if (
      JSON.stringify(newState.edges[i].data) !==
      JSON.stringify(old.edges[i].data)
    ) {
      return false;
    }
  }

  return true;
};
