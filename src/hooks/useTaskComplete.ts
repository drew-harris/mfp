import { useEffect, useState } from "react";
import { RFState, useNodeStore } from "../stores/nodes";
import { useObjectiveStore } from "../stores/objectiveStore";
import { getEdgesIntoOrderNode } from "../utils/queries";
import { itemFromId } from "./useFullItem";

export type NodesAndEdges = Pick<RFState, "nodes" | "edges">;

export interface DebugMessage {
  message: string;
  severity?: "info" | "error" | "warning" | "success";
}

export interface EfficiencyInfo {
  percent: number;
  weight: number;
}

// Check for equality
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

export function useTaskComplete() {
  const state = useNodeStore(
    (s) => ({ nodes: s.nodes, edges: s.edges }),
    strictCompare
  );
  const currentTask = useObjectiveStore((s) => s.currentTask);

  const [messages, setMessages] = useState<DebugMessage[]>([]);
  const [taskComplete, setTaskComplete] = useState(false);
  const [efficiency, setEfficiency] = useState(1);

  useEffect(() => {
    if (!currentTask) return;
    let complete = true;
    const newMessages: DebugMessage[] = [];
    const efficiencyInfo: EfficiencyInfo[] = [];

    // Check for item requirements
    if (currentTask.itemRequirements) {
      const inputEdges = getEdgesIntoOrderNode(state);
      console.log("Input edges", inputEdges);
      const requiremets = currentTask.itemRequirements;
      if (inputEdges.length == 0) {
        newMessages.push({
          message: `No inputs into order node`,
        });
      } else {
        requiremets.forEach((req) => {
          const item = itemFromId(req.itemId);
          const possibleEdge = inputEdges.find(
            (e) => e.data?.item.itemId === req.itemId
          );

          if (possibleEdge) {
            console.log("Found edge", possibleEdge.data?.outputRate);
            if (
              possibleEdge.data?.outputRate != undefined &&
              possibleEdge.data.outputRate < req.perHour
            ) {
              complete = false;
              console.log("Not enough", item.title);
              newMessages.push({
                message: `Not enough ${item.title.toLowerCase()}s`,
              });
            } else if (possibleEdge.data?.outputRate != undefined) {
              const ratio = possibleEdge.data?.outputRate / req.perHour;
              efficiencyInfo.push({
                percent: ratio,
                weight: req.perHour,
              });
            }
          } else {
            newMessages.push({
              message: `Missing order input for ${item.title}`,
            });
          }
        });
      }
      // Check all crafting recipies
    }

    const totalWeight = efficiencyInfo.reduce((a, b) => a + b.weight, 0);
    const totalEfficiency = efficiencyInfo.reduce((a, b) => a + b.percent, 0);

    console.log("Total weight", totalWeight);
    console.log("Total efficiency", totalEfficiency);

    setMessages(newMessages);
    setTaskComplete(complete);
    setEfficiency(totalEfficiency / totalWeight);
  }, [state, currentTask]);

  return { taskComplete, messages, efficiency };
}
