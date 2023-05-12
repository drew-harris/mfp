import { createContext, ReactNode, useEffect, useState } from "react";
import { useNodeStore } from "../../stores/nodes";
import { useObjectiveStore } from "../../stores/objectiveStore";
import { MCNodeType } from "../../types/MCNodes";
import { strictCompare } from "../../utils/comparison";
import {
  getCrafterDebugMessages,
  getEdgesIntoOrderNode,
} from "../../utils/queries";

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

  const orderNodeOnCanvas = useNodeStore((s) =>
    Boolean(s.nodes.some((n) => n.data.dataType === MCNodeType.order))
  );

  const [messages, setMessages] = useState<DebugMessage[]>([]);
  const [taskComplete, setTaskComplete] = useState(false);
  const [efficiency, setEfficiency] = useState(1);

  // TODO: Refactor to lots of query util functions
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

    if (currentTask.continuation) {
      setMessages([]);
      setTaskComplete(true);
    }

    // Check for item requirements
    if (currentTask.itemRequirements) {
      const inputEdges = getEdgesIntoOrderNode(state);
      const requirements = currentTask.itemRequirements;
      if (inputEdges.length === 0 && orderNodeOnCanvas) {
        complete = false;
        // newMessages.push({
        //   message: `No inputs into order node`,
        // });
      } else {
        // Loop through item requirements
        for (const req of requirements) {
          // const item = itemFromId(req.itemId);
          const possibleEdge = inputEdges.find(
            (e) => e.data?.item.itemId === req.itemId
          );

          if (possibleEdge) {
            if (
              possibleEdge.data?.outputRate &&
              possibleEdge.data.outputRate < req.perHour
            ) {
              complete = false;
              // newMessages.push({
              //   message: `Not enough ${item.title.toLowerCase()}s`,
              // });
            } else if (possibleEdge.data?.outputRate) {
              const ratio = possibleEdge.data?.outputRate / req.perHour;
              efficiencyInfo.push({
                percent: ratio,
                weight: req.perHour,
              });
            }
          } else {
            complete = false;
            // newMessages.push({
            //   message: `Missing order input for ${item.title}`,
            // });
          }
        }
      }
      // Check all crafting recipies
    }
    const craftingMessages = getCrafterDebugMessages(state);
    console.log("Crafting messages", craftingMessages);
    // newMessages.push(...craftingMessages);

    // Efficiency
    const totalWeight = efficiencyInfo.reduce((a, b) => a + b.weight, 0);
    const totalEfficiency = efficiencyInfo.reduce((a, b) => a + b.percent, 0);

    console.log("Total efficiency", totalEfficiency);

    console.log("New Messages", newMessages);

    // Check for state requirement
    if (currentTask.stateRequirement) {
      const stateRequirement = currentTask.stateRequirement;
      console.log(useNodeStore.getState().nodes);
      const passes = stateRequirement(useNodeStore.getState());
      if (!passes) {
        console.log("State requirement failed");
        complete = false;
      }
      newMessages.push(...messages);
    }

    setMessages(newMessages);
    setTaskComplete(complete);
    setEfficiency(totalEfficiency / totalWeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, currentTask, orderNodeOnCanvas]);

  useEffect(() => {
    console.log("Messages", messages);
  }, [messages]);

  return (
    <TaskCompleteContext.Provider
      value={{ messages, taskComplete, efficiency }}
    >
      {children}
    </TaskCompleteContext.Provider>
  );
}
