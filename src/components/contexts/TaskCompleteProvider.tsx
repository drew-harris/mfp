import { createContext, ReactNode, useEffect, useState } from "react";
import { useNodeStore } from "../../stores/nodes";
import { useObjectiveStore } from "../../stores/objectiveStore";
import { MCNodeType } from "../../types/MCNodes";
import { strictCompare } from "../../utils/comparison";
import { getEdgesIntoOrderNode } from "../../utils/queries";

interface TaskCompleteProviderValue {
  messages: DebugMessage[];
  taskComplete: boolean;
  efficiency: number;
  deficit: number;
  excess: number;
}

export interface DebugMessage {
  message: string;
  severity?: "info" | "error" | "warning" | "success";
}

export interface EfficiencyInfo {
  requirement: number;
  output: number;
}

const defaults: TaskCompleteProviderValue = {
  messages: [],
  taskComplete: false,
  efficiency: 0,
  deficit: 0,
  excess: 0,
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
  const [deficit, setDeficit] = useState(0);
  const [excess, setExcess] = useState(0);

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
      // console.log("Requirements:");
      // for (const entry of requirements) {
      //   console.log(`ItemId: ${entry.itemId}, Rate: ${entry.rate}`);
      // }
      if (inputEdges.length === 0 && orderNodeOnCanvas) {
        complete = false;
        // newMessages.push({
        //   message: `No inputs into order node`,
        // });
      } else {
        // Loop through item requirements
        for (const req of requirements) {
          // const item = itemFromId(req.itemId);
          const edge = inputEdges.find(
            (e) => e.data?.item.itemId === req.itemId
          );
          if (edge?.data?.outputRate) {
            // console.log(
            //   "edge detected: " +
            //     edge.data.item.title +
            //     " " +
            //     edge.data.outputRate
            // );
            if (edge.data.outputRate < req.rate) {
              complete = false;
              // newMessages.push({
              //   message: `Not enough ${item.title.toLowerCase()}s`,
              // });
            }
            const ratio = edge.data.outputRate / req.rate;
            efficiencyInfo.push({
              requirement: req.rate,
              output: edge.data?.outputRate,
            });
            // console.log("Ratio", ratio);
          } else {
            complete = false; //todo: refactor repetitive code
            const ratio = 0;
            efficiencyInfo.push({
              requirement: req.rate,
              output: 0,
            });
            // console.log("Ratio", ratio);
            // newMessages.push({
            //   message: `Missing order input for ${item.title}`,
            // });
          }
        }
      }
      // Check all crafting recipies
    }
    // const craftingMessages = getCrafterDebugMessages(state);
    // console.log("Crafting messages", craftingMessages);
    // // newMessages.push(...craftingMessages);

    // Efficiency
    // console.log("Efficiency Info", efficiencyInfo);
    const totalRequirement = efficiencyInfo.reduce(
      (a, b) => a + b.requirement,
      0
    );
    const totalAchieved = efficiencyInfo.reduce((a, b) => a + b.output, 0);
    // divide by total achieved or total requirement?
    const totalDeficit =
      efficiencyInfo.reduce(
        (a, b) => a + Math.max(b.requirement - b.output, 0),
        0
      ) / totalRequirement;
    const totalExcess =
      efficiencyInfo.reduce(
        (a, b) => a + Math.max(b.output - b.requirement, 0),
        0
      ) / totalAchieved;
    const totalEfficiency = efficiencyInfo
      .map(
        (item) =>
          (Math.min(item.output, item.requirement) /
            Math.max(item.output, item.requirement)) *
          (item.requirement / totalRequirement)
      )
      .reduce((a, b) => a + b, 0); // todo: FIX FORMULA

    // console.log("Total Requirement:", totalRequirement);
    // console.log("Total Achieved:", totalAchieved);
    // console.log("Total Efficiency:", totalEfficiency);
    // console.log("Total Deficit:", totalDeficit);
    // console.log("Total Excess:", totalExcess);
    //
    // console.log("New Messages", newMessages);

    // Check for state requirement
    if (currentTask.stateRequirement) {
      const stateRequirement = currentTask.stateRequirement;
      console.log(useNodeStore.getState().nodes);
      console.log(useNodeStore.getState().edges);
      const passes = stateRequirement(useNodeStore.getState());
      if (!passes) {
        console.log("State requirement failed");
        complete = false;
      }
      newMessages.push(...messages);
    }

    setMessages(newMessages);
    setTaskComplete(complete);
    setEfficiency(Math.max(totalEfficiency, 0));
    setDeficit(totalDeficit);
    setExcess(totalExcess);
    console.log("TASK COMPLETE", complete);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, currentTask, orderNodeOnCanvas]);

  return (
    <TaskCompleteContext.Provider
      value={{ messages, taskComplete, efficiency, deficit, excess }}
    >
      {children}
    </TaskCompleteContext.Provider>
  );
}
