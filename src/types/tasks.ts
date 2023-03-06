import { DebugMessage } from "../hooks/useTaskComplete";
import { RFState } from "../stores/nodes";
import { DraggableType, MCNodeType } from "./MCNodes";

export interface Mission {
  title: string;
  description?: string;
  tasks: Task[];

  // List of all available items for the mission
  idPool?: string[];
}

export interface Task {
  itemRequirements?: ItemRequirement[];
  nodeRequirements?: NodeRequirement[];
  stateRequirement?: (state: RFState) => {
    status: boolean;
    messages: DebugMessage[];
  };

  description?: string;
  title?: string;
  id: string;

  idPool?: string[] | "inherit";
}

export interface ItemRequirement {
  itemId: string;
  perHour: number;
}

export interface NodeRequirement {
  nodeType: MCNodeType;
  itemId?: string;
  amount: number;
}

export interface DraggableOrderData {
  type: MCNodeType.order;
  task: Task;
  draggableType: DraggableType.order;
}
