import { createContext, ReactNode, useEffect, useState } from "react";
import { itemFromId } from "../../hooks/useFullItem";
import { strictCompare } from "../../utils/comparison";
import { useNodeStore } from "../../stores/nodes";
import { useObjectiveStore } from "../../stores/objectiveStore";
import { getEdgesIntoOrderNode } from "../../utils/queries";

interface TaskCompleteProviderValue {
  messages: DebugMessage[];
  taskComplete: boolean;
  efficiency: number;
}

export interface DebugMessage {
  message: string;
  severity?: "info" | "error" | "warning" | "success";
}

export interface EfficiencyInfo {
  percent: number;
  weight: number;
}

const defaults: TaskCompleteProviderValue = {
  messages: [],
  taskComplete: false,
  efficiency: 1,
};

export const TaskCompleteContext =
  createContext<TaskCompleteProviderValue>(defaults);

export default function TaskCompleteProvider({
  children,
}: {
  children: ReactNode;
}) {
  const state = useNodeStore(
    (s) => ({ nodes: s.nodes, edges: s.edges }),
    strictCompare
  );
  const currentTask = useObjectiveStore((s) => s.currentTask);

  const [messages, setMessages] = useState<DebugMessage[]>([]);
  const [taskComplete, setTaskComplete] = useState(false);
  const [efficiency, setEfficiency] = useState(1);
  useEffect(() => {
    if (!currentTask) {
      setMessages([]);
      setTaskComplete(false);
      setEfficiency(1);
      return;
    }

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

  return (
    <TaskCompleteContext.Provider
      value={{ messages, taskComplete, efficiency }}
    >
      {children}
    </TaskCompleteContext.Provider>
  );
}
